import { useEffect, useState } from 'react'
import { FcSearch } from 'react-icons/fc';
import './App.css'
import Data from "./mock-data.json"
import DataTable from './components/DataTable';
import { useOutletContext } from 'react-router-dom';

function App() {
  const [isActive, setActive] = useState(false)
  const [info, setInfo] = useOutletContext()

  // useEffect(() => {
  //   fetch('http://127.0.0.1:5000/api/get/all/refugees')
  //     .then(response => response.json())
  //     .then(response => {
  //       console.log(response)
  //       setInfo(response);
  //     }).catch(error => console.log(error))

  // }, [])

  // useEffect(() => {
  //   // fetch('http://127.0.0.1:5000/api/get')
  //   // fetch('mock-data.json')
  //   //   .then(response => response.json())
  //   //   .then(response => {
  //   //     console.log(response)
  //   //     setInfo(response);
  //   //   })
  //   //   .catch(error => console.log(error))
  //   setInfo(Data)
  //   console.log(Data)

  // }, [])

  const [query, setQuery] = useState("")

  return (
    // <div className="App">
    //   {info && <p>{JSON.stringify(info)}</p>}
    // </div>
    <div className='p-10'>
      <h1 className='font-bold text-6xl p-10'>The Refugee Board</h1>
      <div className='text-center'>
        <div className='flex-row'>
          <input placeholder="Enter name" onChange={event => setQuery(event.target.value)} onClick={event => setActive(prev => !prev)} className={/*isActive ? 'border-black border-2 px-7 py-3 w-[80%]' :*/ 'border-black border-y px-7 py-3 w-[60%]'} />
          <FcSearch className='text-center inline-block text-4xl ' />
        </div>
        {/* {JSON.stringify(Data)} */}
        <DataTable data={info} query={query} col={["Name", "Gender", "CampName", "CampAddress", "CountryOfOrigin", "Age", "Message", "MessageDate"]} deleteEntry={undefined} editEntry={undefined} />
      </div>
    </div>
  )
}

export default App
