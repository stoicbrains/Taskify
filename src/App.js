import React, { Component } from 'react'
import "./App.css"
import Login from './Component/Login'
import Todo from './Component/Todo'
import Navbar from './Component/Navbar'
import Register from './Component/Register'
import {BrowserRouter,Navigate,Route,Routes} from 'react-router-dom'
import Home from './Component/Home'

const ProtectedRoute = ({element:Component,...rest})=>{
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated?<Component {...rest}/>:<Navigate to='/Login'/>
}
export default function App() {
  return (
    <div>
      
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Todo' element={<ProtectedRoute element={Todo}/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Register' element={<Register/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}
