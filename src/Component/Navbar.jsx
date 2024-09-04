import React from 'react'
import './Navbar.css'
import '../'
import { useNavigate} from 'react-router-dom';
import Logo from '../Assets/Taskify.png'
function Navbar() {
  const isAuthenticated = localStorage.getItem('token')
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');}

  const handleLogin =()=>{
    navigate('/Login')
  }
  return (
    <nav>
   
      <ul>
      <img src={Logo} alt="404error" height={100} width={150} style={{position:'relative',left:'0px',bottom:'0px'}} />
        <li className='flow'><a href="/">Home</a></li>
        <li className='flow'><a href="/Todo">Todo</a></li>
        <li className='flow'><a href="">Content1</a></li>
        <li onClick={isAuthenticated?handleLogout:handleLogin} className='' id='login'><a href={''}>{isAuthenticated?'Logout':'Login'}</a></li>
      </ul>
      </nav>
  )
}

export default Navbar
