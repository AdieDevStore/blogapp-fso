import { useState } from "react"

  const CreatePost = () => {

    const [post, setPost] = useState({name: '', content: ''})

    // cleeeeeeeeeeean
    const handlePostChange = e => {
      e.target.id === 'title' ? setPost({...post, name: e.target.value}) 
      : setPost({...post, content: e.target.value})
    }

    return (
      <div>
        <h1>Create post</h1>
        <div>
          <form action="POST">
            <label htmlFor="title">Title</label>
            <input type="text" name="Title" id="title" onChange={handlePostChange} />
            <label htmlFor="content">Content</label>
            <input type="text" name="Content" id="content" onChange={handlePostChange} />
          </form>
        </div>
      </div>
    )
  }

  export default CreatePost