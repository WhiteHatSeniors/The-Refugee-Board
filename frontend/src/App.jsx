import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [info, setInfo] = useState(null);

  // useEffect(() => {
  //   fetch('http://127.0.0.1:5000/api/get')
  //     .then(response => response.json())
  //     .then(response => {
  //       console.log(response)
  //       setInfo(response);
  //     })
  //     .catch(error => console.log(error))

  // }, [])

  return (
    // <div className="App">
    //   {info && <p>{JSON.stringify(info)}</p>}
    // </div>
    <div>
      <h1>Yooo sup</h1>
    </div>
  )
}

export default App
