const Blog = ({ blog }) => {

  return (
    <div className="Blog">
      {blog.title} by {blog.author}
    </div>
  )
}

export default Blog