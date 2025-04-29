import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({name:"", email: "", password: "",cpassword:"" })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name,email,password,cpassword}=credentials;
    if (password!==cpassword){
      props.alt1("Password and confirm password didn't match please check again","danger")
      return;
    }
    const response = await fetch("http://localhost:5000/api/login/createuser", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({name,email,password })
    })
    const json = await response.json();
    console.log(json);
    if (json.success){
      //redirect
      localStorage.setItem('token',json.token)
      navigate('/plagiarism')
      // props.alt1("successfully signed up","success")
  }else if(json.error==='sorry a user with this email already exists'){
    // props.alt1('sorry a user with this email already exists',"danger")
  }
  else{
      props.alt1("please fill the form correctly ","danger")
  }
    
  
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div  className='mx-4 my-4'>
      <div >
        <h2>please signup to continue</h2>
      </div>
    <form  onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label my-4">Name </label>
        <input required type="text" onChange={onChange} className="form-control" name='name' id="name" aria-describedby="emailHelp" />

      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email address</label>
        <input type="email" required onChange={onChange} className="form-control" name='email' id="email" aria-describedby="emailHelp" />
        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" onChange={onChange} className="form-control" minLength={5} required name='password' id="password" />
      </div>
      <div className="mb-3">
        <label htmlFor="cpassword" className="form-label">Confirm Password</label>
        <input type="password" onChange={onChange} className="form-control" minLength={5} required name='cpassword' id="cpassword" />
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    </div>
  )
}

export default Signup
