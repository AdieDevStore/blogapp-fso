  const EditPost = () => {
    // state mustbe passed form original blog to this element
    
    return (
      <div>
        <h1>Edit Post</h1>
        <div>
          <form action="POST">
            <label htmlFor="name">Name</label>
            <input type="text" name="Name" id="name" />
            <label htmlFor="content">URL</label>
            <input type="text" name="Content" id="content" />
          </form>
        </div>
      </div>
    )
  }

  export default EditPost