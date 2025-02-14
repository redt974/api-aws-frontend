import React from 'react'
import './index.css'

function Loading() {
  return (
    <div>
      <div className="loader-wrapper">
          <div className="loader"></div>
          <p>Chargement ...</p>
      </div>
    </div>
  )
}

export default Loading
