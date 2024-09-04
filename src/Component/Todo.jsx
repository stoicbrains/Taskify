import { useEffect, useRef, useState } from 'react';
import './Todo.css';
import axios from 'axios';
import { useAnimation, useInView,motion, easeOut } from 'framer-motion';

function Todo() {
  const ref = useRef(null);
  const inView = useInView(ref,{once:true});
  const controls = useAnimation();
  const variants={hidden:{opacity:0,x:-500},
visible:{opacity:1,x:0}};
  const [Title, setTitle] = useState('');
  const [Desc, setDesc] = useState('');
  const [List, setList] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const user = localStorage.getItem('Username');
  const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((res) => {
        const filteredData = res.data.filter(todo => todo.username === user);
        setList(filteredData);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error.response.data);
      });
    }
  }, [token, user]);
  useEffect(()=>{
    if(inView){
      controls.start('visible');
    }
  },[inView,controls])
  const OnTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const OnDescChange = (event) => {
    setDesc(event.target.value);
  };

  const OnSubmit = async (event) => {
    event.preventDefault();

    const todo = {
      time: new Date().toISOString(),
      title: Title,
      desc: Desc,
      completed: false,
    };

    try {
      let response;
      if (editMode) {
        response = await axios.put(`http://localhost:5000/api/todos/${editMode}`, todo, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token for updating
          },
        });

        if (response.status === 200) {
          const updatedTodo = response.data.todo; // Assuming the updated todo is returned
          setList(List.map((item) => (item._id === editMode ? updatedTodo : item)));
          console.log('Todo updated', updatedTodo);
        }
      } else {
        response = await axios.post('http://localhost:5000/api/todos', todo, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token for creating
          },
        });

        if (response.status === 201) {
          const newTodo = response.data.todo;
          setList([...List, newTodo]);
          console.log('Todo created', newTodo);
        }
      }

      setTitle('');
      setDesc('');
      setEditMode(null); // Reset edit mode

    } catch (error) {
      console.error('Error submitting todo:', error.response.data);
    }
  };

  const OnEdit = (todo) => {
    setTitle(todo.title);
    setDesc(todo.desc);
    setEditMode(todo._id);
  };

  const OnCancelEdit = () => {
    setTitle('');
    setDesc('');
    setEditMode(null);
  };

  const OnDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token for deleting
        },
      });

      if (response.status === 200) {
        console.log('Todo deleted:', response.data);
        setList(List.filter((todo) => todo._id !== id));
      } else {
        console.log('Failed to delete todo', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting todo:', error.response.data);
    }
  };

  return (
    <motion.div className="App" ref={ref} initial='hidden' variants={variants} animate={controls} transition={{delay:0.3,duration:0.6,ease:easeOut}}>
      <motion.div className="maincontainer">
        <div className='formContainer'>
          <form onSubmit={OnSubmit} className="form">
            <input
              type='text'
              placeholder='Title'
              id='title'
              value={Title}
              onChange={OnTitleChange}
              required
            />
            <input
              type='textarea'
              placeholder='Description'
              value={Desc}
              onChange={OnDescChange}
              required
            />
            <button type='submit' className='submitbtn'>
              {editMode ? 'Update' : 'Submit'}
            </button>
            {editMode && <button type="button" className='cancelbtn' onClick={OnCancelEdit}>Cancel</button>}
          </form>
          <div className="screen">
            {List.map((ele, indx) => (
              <div key={indx} className='todos'>
                {editMode === ele._id ? (
                  <>
                    <div id='editdiv'>
                      <input
                        type="text"
                        value={Title}
                        onChange={OnTitleChange}
                        placeholder="Edit Title"
                        className='editText'
                      />
                      <input
                        type="text"
                        value={Desc}
                        onChange={OnDescChange}
                        placeholder="Edit Description"
                        className='editText'
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className='main'>
                      <p>Title</p>
                      <div>{ele.title}</div>
                      <p>Description</p>
                      <div>{ele.desc}</div>
                    </div>
                    <div className='second'>
                      <input type="checkbox" id='check'/>
                      <div>
                        <button id='delete' onClick={() => OnDelete(ele._id)}>Delete</button>
                      </div>
                      <div>
                        <button id='edit' onClick={() => OnEdit(ele)}>Edit</button>
                      </div>
                      <div>
                      </div>
                    </div>
                    
                  </>
                )}
                <div><hr style={{backgroundColor:'white',height:'2px',width:'115%'}}/></div>
              </div>
              
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Todo;
