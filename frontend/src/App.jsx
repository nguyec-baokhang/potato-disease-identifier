import { useState } from 'react'
import './App.css'
import Header from './assets/Header'
import UploadFile from './assets/UploadFile'

function App() {
  


  return (
    <>
      <Header/>
      <div className='shadow-xl pt-6'>
        <UploadFile/>
      </div>
    </>
  )
}

export default App
