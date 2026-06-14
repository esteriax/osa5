import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import BlogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogFormVisible, setBlogFormVisible] = useState(false)


  useEffect(() => {
    console.log('haetaan blogit palvelimelta')
    const fetchBlogs = async () => {
      try {
        const initialBlogs = await BlogService.getAll()
        setBlogs(initialBlogs)
        console.log('blogit haettu palvelimelta')
      } catch {
        setErrorMessage('blogien haku epäonnistui')
        setTimeout(() => setErrorMessage(null), 5000)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      BlogService.setToken(user.token)
    }
  }, [])

  const addBlog = async event => {
    event.preventDefault()
     console.log('lisätään blogi palvelimelle')
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }

    try {
      const returnedBlog = await BlogService.create(blogObject)
      console.log('returnedBlog:', returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '' })
      console.log('blogi lisätty')
      alert(`a new blog ${returnedBlog.title} added`)
      setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch {
      console.log('blogin lisääminen epäonnistui')
      setErrorMessage('blog could not be added')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      console.log('kirjaudutaan sisään')
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      BlogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      console.log('sisäänkirjautuminen onnistui')
      setSuccessMessage('sisäänkirjautuminen onnistui')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch {
      console.log('sisäänkirjautuminen epäonnistui')
      setErrorMessage('väärä käyttäjätunnus tai salasana')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const logOut = () => {
    console.log('kirjaudutaan ulos')
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    console.log('uloskirjautuminen onnistui')
    setSuccessMessage('uloskirjautuminen onnistui')
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  const BlogsToShow = showAll
    ? blogs
    : blogs.filter(blog => blog.title)

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogFormVisible(true)}>create new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            addBlog={addBlog}
            newBlog={newBlog}
            setNewBlog={setNewBlog}
          />
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={successMessage} color="green" />
      <Notification message={errorMessage} color="red" />
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={logOut}>logout</button>
          </p>
          {blogForm()}
          {BlogsToShow
            .filter(blog => blog.user?.username === user.username)
            .map(blog => (
              <Blog key={blog.id} blog={blog} />
            ))}
        </div>
      )}
      <Footer />
    </div>
  )
}

export default App
