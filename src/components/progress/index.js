import React from 'react'
import './index.css'

function Progress({ progress }) {
  return (
    <div>
      <div className="progress-wrapper">
        <div className="progress"></div>
        <pre>{progress}</pre>
      </div>
    </div>
  )
}

export default Progress
