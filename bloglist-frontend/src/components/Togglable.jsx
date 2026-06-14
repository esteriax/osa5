import { useState, useImperativeHandle, forwardRef } from 'react'

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => ({ toggleVisibility }))

  if (!visible) {
    return <button onClick={toggleVisibility}>{buttonLabel}</button>
  }

  return (
    <div>
      {children}
      <button onClick={toggleVisibility}>cancel</button>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
