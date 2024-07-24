import React from 'react'
import Axios from 'axios'

function Login({success, setSuccess, userInformation, setUserInformation}) {

  const token = localStorage.getItem('Bearer')

  const updateFormInformation = (e) => {

    if (e.target.id === 'username') {
      console.log(e.target.value)
      setUserInformation({...userInformation, username: userInformation.username = e.target.value})
      console.log(userInformation)
      return
    }
    
    if (e.target.id === 'password') {
      setUserInformation({...userInformation, password: e.target.value})
      console.log(userInformation)
      return
    }
  }

  const submitHandle = (e) => {
    if (!token) {
      setSuccess('Already logged in')
      return
    }
    e.preventDefault()
    Axios.post('http://localhost:3003/api/login', {userInformation})
    .then(response => localStorage.setItem('Bearer', response.data.token))
    .then(setSuccess(true))
    .catch(error => {
      if (error) {
        setSuccess(false)
      }
    })
  }

  return (
    <div>
      <h1>Login Form</h1>
      <br />
        <div className="loginMessageContainer">
          <p>{success ?  'already logged in' : 'login fail' }</p>
        </div>
      <div className='loginContainer'>
        <form action="POST" className='loginForm'>
          <label htmlFor="username">Username:</label>
          <input type="text" name="Username" id="username" onChange={updateFormInformation} value={userInformation?.username}/>
          <label htmlFor="password">Password:</label>
          <input type="password" name="Password" id="password" onChange={updateFormInformation} value={userInformation?.password}/>
          <br />
          <button type="submit" onClick={submitHandle}>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login