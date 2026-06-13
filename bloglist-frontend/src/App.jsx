import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import Blog from './components/Blog'
import Notification from './components/Notification'
import loginService from './services/login'
import BlogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    BlogService.getAll().then(initialBlogs => {
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      BlogService.setToken(user.token)
    }
  }, [])

  const addBlog = event => {
    event.preventDefault()
    const BlogObject = {
      title: newBlog,
    }

    BlogService.create(BlogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog('')
    })
  }

  {/*const toggleImportanceOf = id => {
    const Blog = blogs.find(n => n.id === id)
    const changedBlog = { ...Blog, important: !Blog.important }

    BlogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(Blog => (Blog.id !== id ? Blog : returnedBlog)))
      })
      .catch(() => {
        setErrorMessage(
          `Blog '${Blog.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setBlogs(blogs.filter(n => n.id !== id))
      })
  }*/}

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      BlogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogChange = event => {
    setNewBlog(event.target.value)
  }

  const BlogsToShow = showAll ? blogs : blogs.filter(Blog => Blog.important)

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const BlogForm = () => (
    <form onSubmit={addBlog}>
      <input value={newBlog} onChange={handleBlogChange} />
      <button type="submit">create</button>
    </form>
  )

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in 
          <button onClick={() => logOut()}>logout</button>
          </p>
        {BlogsToShow
          .filter(blog => blog.user?.username === user.username)
          .map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
            />
      ))}
        {/*{BlogForm()}*/}
        </div>
      )}
     

      <Footer />
    </div>
  )
}

export default App