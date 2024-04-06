const dummy = (blogs) => {
  return 1
}

// this only works on blog
const totalLikes = (blogs) => {
  let highest = 0
  blogs.forEach(blog => {
    if (blog.likes > highest) {
      highest = blog.likes
    }
  });
  console.log(highest)
  return highest
}

const favouriteBlog = (blogs) => {
  let favourite = blogs.reduce((favourite, blog) => {
    return favourite.likes > blog.likes ? favourite : blog
  }, {})
  return favourite
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}