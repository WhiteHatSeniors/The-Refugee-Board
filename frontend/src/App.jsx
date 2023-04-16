import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isActive, setActive] = useState(false)
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // fetch('http://127.0.0.1:5000/api/get')
    fetch('./mock-data.json')
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setInfo(response);
      })
      .catch(error => console.log(error))

  }, [])

  const [query, setQuery] = useState("")

  return (
    // <div className="App">
    //   {info && <p>{JSON.stringify(info)}</p>}
    // </div>
    <div className='p-10'>
      <h1 className='font-bold text-6xl p-10'>The Refugee Board</h1>
      <div className='text-center'>
        <input placeholder="Enter name" onChange={event => setQuery(event.target.value)} onClick={event => setActive(prev => !prev)} className={isActive ? 'border-black border-2 px-7 py-3 w-[80%]' : 'border-black border px-7 py-3 w-[80%]'} />
        {
          info && info.length > 0 && info.filter(post => {
            if (post.name.toLowerCase().includes(query.toLowerCase())) {
              return post;
            }
          }).map((post, index) => {
            <div key={index}>
              <p>{post.title}</p>
              <p>{post.author}</p>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default App
