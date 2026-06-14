import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import Blog from './components/Blog'
import Notification from './components/Notification'
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

  console.log('haetaan palvelimelta')
  useEffect(() => {
    BlogService.getAll()
    .then(initialBlogs => {
      console.log('promise täytetty')
      setBlogs(initialBlogs)
      console.log('blogit haettu palvelimelta')
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
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }

    console.log('luodaan uusi blogi')
    BlogService
      .create(BlogObject)
      .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '' })
      console.log('asetetaan onnistumisviesti')
      setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
          setSuccessMessage(null)
        }, 10000)
      console.log('blogi luotu palvelimelle')
    })
    .catch(() => {
      setErrorMessage('blog could not be added')
      setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
    )
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
    console.log('yritetään kirjautua')
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      BlogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      console.log('kirjautuminen onnistui')
      setSuccessMessage('sisäänkirjautuminen onnistui')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)  
    } catch {
      setErrorMessage('väärä käyttäjätunnus tai salasana')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const BlogsToShow = showAll ? blogs : blogs.filter(Blog => Blog.title)

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
      <h2>create new</h2>
      <div>title: <input value={newBlog.title} onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })} /></div>
      <div>author: <input value={newBlog.author} onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })} /></div>
      <div>url: <input value={newBlog.url} onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })} /></div>
      <button type="submit">create</button>
    </form>
  )

  const logOut = () => {
    console.log('kirjaudutaan ulos')
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    console.log('uloskirjautuminen onnistui')
    setSuccessMessage('uloskirjautuminen onnistui')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={successMessage} color="green"/>
      <Notification message={errorMessage} color="red"/>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in 
          <button onClick={() => logOut()}>logout</button>
          </p>
          {BlogForm()}
        {BlogsToShow
          .filter(blog => blog.user?.username === user.username)
          .map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
            />
      ))}
        </div>
      )}
     

      <Footer />
    </div>
  )
}

export default App