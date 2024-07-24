import { useState } from "react"

  const Register = () => {

    const [userDetails, setUserDetail] = useState({username: '', password: ''})

    // cleeeeeeeeean
    const handleUserDetailChange = e => {
      e.target.id === 'username' ? setUserDetail({...userDetails, username: e.target.value}) 
      : setUserDetail({...userDetails, password: e.target.value})
    }

    return (
      <div>
        <h1>Register</h1>
        <div>
          <form action="POST">
            <label htmlFor="username">Username</label>
            <input type="text" name="Usersame" id="username" onChange={handleUserDetailChange} />
            <label htmlFor="password">Password</label>
            <input type="text" name="Password" id="password" onChange={handleUserDetailChange} />
          </form>
        </div>
      </div>
    )
  }

  export default Register