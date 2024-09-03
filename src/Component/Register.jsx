import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });


  const Navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.name) {
      formErrors.name = 'Name is required';
    }

    if (!formData.username) {
      formErrors.username = 'Username is required';
    }

    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };


  
  const handleSubmit = async(e) =>{
    e.preventDefault();
    validateForm();
    const user = {
      Name:formData.name,
      username:formData.username,
      password:formData.password,
    }

    
    try{
      const response = await fetch(('http://localhost:5000/api/users'),{
        method:'POST',
        headers:{
          'content-type':'application/json'
        },
        body:JSON.stringify(user),
      });
      if (response.status === 409) {
        alert('Username already exists. Please choose a different one.');}
      if(response.ok){
        const res = await response.json();
        console.log("user created",res);
        setFormData({
          name:'',
          username:'',
          password:'',
          confirmPassword:''

        })
        Navigate('/Login')
      }
      else{
        console.log("Failed to create User", response.status, response.statusText);
      }
    }
    catch(error){
      console.log("Error",error.message);
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" style={{cursor:'pointer'}}>Register</button>
      </form>
    </div>
  );
}

export default Register;
