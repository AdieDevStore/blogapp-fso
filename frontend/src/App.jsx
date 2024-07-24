import * as React from 'react'
import { useState } from 'react'
import Login from '../components/login'
import Register from '../components/register'
import CreatePost from '../components/createpost'
import ViewBlogs from '../components/viewBlogs'
import EditPost from '../components/editPost'
import {BrowserRouter as Router, Routes, Route, Navigate, Outlet} from 'react-router-dom'

function App() {
  const [userInformation, setUserInformation] = useState({username: '', password: ''})
  const [success, setSuccess] = useState(false)

  const Home = () => {
    return (
      <div>
        <h1>Home Page</h1>
      </div>
    )
  }

  const PrivateBlogsRoute = () => {
    const token = localStorage.getItem('Bearer')
    return (
      token ? <Outlet /> : <Navigate to={'/login'} />
    )
  }


  return (
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login userInformation={userInformation} setUserInformation={setUserInformation} success={success} setSuccess={setSuccess}/>} />
            <Route element={<PrivateBlogsRoute />}>
              <Route path='/blogs' element={<ViewBlogs />} />
              <Route path='/edit-post' element={<EditPost />} />
              <Route path='/create-post' element={<CreatePost />} />
            </Route>
        </Routes>
      </Router>
  )
}

export default App
