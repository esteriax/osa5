import BlogService from '../services/blogs'
import { useState } from 'react'
import Notification from './Notification'

const BlogForm = ({createBlog}) => {
    const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

    const addBlog = async (blogObject) => {
        event.preventDefault()
         console.log('lisätään blogi palvelimelle')
         createBlog({
          title: newBlog.title,
          author: newBlog.author,
          url: newBlog.url
        })

        setNewBlog({ title: '', author: '', url: '' })
        console.log('blogi lisätty')
        
      }
      return (
        <div>
          <h2>Create a new note</h2>
          <form onSubmit={addBlog}>
            <div>
              title:
              <input
                value={newBlog.title}
                onChange={ event => setNewBlog({ ...newBlog, title: event.target.value })}
              />
            </div>
            <div>
              author:
              <input
                value={newBlog.author}
                onChange={ event => setNewBlog({ ...newBlog, author: event.target.value })}
              />
            </div>
            <div>
              url:
              <input
                value={newBlog.url}
                onChange={ event => setNewBlog({ ...newBlog, url: event.target.value })}
              />
            </div>
            <button type="submit">create</button>
          </form>
        </div>
      )
    /*return (
    <div>
      <h2>Create a new note</h2>
      <div>

        title:
        <input
          value={newBlog.title}
          onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
        />
      </div>
      <div>
        author:
        <input
          value={newBlog.author}
          onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
        />
      </div>
      <div>
        url:
        <input
          value={newBlog.url}
          onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
        />
      </div>
      <button type="submit">create</button>
    </div>
  )
}


    /*const addBlog = async event => {
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
        
      }*/
}
  export default BlogForm