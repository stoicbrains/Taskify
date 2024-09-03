import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);

      console.log("Login successful, JWT token:", token);
      navigate("/");
      setUsername('')
      setPassword('')
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("User not found");
      } else if (err.response && err.response.status === 401) {
        setError("Invalid password");
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <div className="mainContainer">
      <div>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab voluptatum
        rem saepe debitis incidunt asperiores mollitia, magnam delectus
        molestias illo deleniti obcaecati consequuntur quia? Ex eos blanditiis
        ut mollitia magni!5
      </div>
      <div className="formcontainer">
        <form onSubmit={handleSubmit} id="form1">
          <h2 style={{textAlign:'center'}}>Login</h2>
          <div>
           
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="LoginForminput"
            />
          </div>
          <div>
            
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="LoginForminput"
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" id="loginbtn">Login</button>
          <p style={{ color: "white" }}>
            If user does not <a href="/register">exist?</a>
          </p>
        </form>
      </div>
      

    </div>
  );
};

export default Login;
