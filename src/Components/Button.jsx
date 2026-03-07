import React from 'react'

const Button = ({ children, onClick, className="" }) => {
  return (
    <button className={`px-8 py-3 rounded-full font-[Poppins] cursor-pointer shadow-md transition ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
