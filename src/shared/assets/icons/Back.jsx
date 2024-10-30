import React from 'react'

export default function Back({color = "#000000", size = "20" }) {
  return (
    <div>
        <svg 
           width={size}
           height={size}
           viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 18L5 12M5 12H19H5ZM11 6L5 12L11 6Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
    </div>
  )
}
