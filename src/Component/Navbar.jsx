import React from 'react'
import './Navbar.css'
import { useNavigate} from 'react-router-dom';
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
        <li className='flow'><a href="/">Home</a></li>
        <li className='flow'><a href="/Todo">Todo</a></li>
        <li className='flow'><a href="">Content1</a></li>
        <li onClick={isAuthenticated?handleLogout:handleLogin} className='' id='login'><a href={''}>{isAuthenticated?'Logout':'Login'}</a></li>
      </ul>
      </nav>
  )
}

export default Navbar
