import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/login/login", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    })
    const json = await response.json();
    console.log(json);
    if (json.success) {
      //redirect
      localStorage.setItem('token', json.token)
      navigate('/plagiarism')
      // props.alt1("successfully logged in", "success")
    }
    else {
      // props.alt1("invalid credentials", "danger")
    }

  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div className='mx-4 my-4'>
      <div>
        <div className='mt-1 mb-3'>
          <h2>Please login to continue</h2>
        </div>
        <form onSubmit={handleSubmit} >
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" required onChange={onChange} className="form-control" id="email" name='email' aria-describedby="emailHelp" />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" required minLength={5} onChange={onChange} className="form-control" id="password" name='password' />
          </div>

          <button type="submit" className="btn btn-primary my-3" >Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Login
