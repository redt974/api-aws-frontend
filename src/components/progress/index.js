import React from 'react'
import './index.css'

function Progress({ progress }) {
  return (
    <div>
      <div className="progress-wrapper">
        <div className="progress"></div>
        <p>{progress}</p>
      </div>
    </div>
  )
}

export default Progress
