  const ViewBlogs = () => {

    const list = [
      {id: 1, author: 'test user 7', url: 'wwww.google.com'},
      {id: 2, author: 'test user 7', url: 'wwww.facebook.com'}
    ]

    return (
      <div>
        <h1>Blogs</h1>
        <div>
          {
            list.map(itm => 
            <div key={itm.id}>
              <p>{itm.author}</p>
              <a href={itm.url}>{itm.url}</a>
            </div>
            )
          }
        </div>
      </div>
    )
  }

  export default ViewBlogs