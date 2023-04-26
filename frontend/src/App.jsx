import { useEffect, useState } from 'react'
import { FcSearch } from 'react-icons/fc';
import './App.css'
import Data from "./mock-data.json"
import DataTable from './components/DataTable';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AxFetch from './utils/axios';

function App() {
  const [isActive, setActive] = useState(false)
  const [info, setInfo] = useOutletContext()
  const [query, setQuery] = useState("")

  // useEffect(() => {
  //     fetch('/api/get/all/refugees')
  //         .then(response => response.json())
  //         .then(response => {
  //             console.log(response)
  //             setInfo(response);
  //         }).catch(error => console.log(error))
  // }, [])


  const getRefsFn = async () => {
    const res = await AxFetch.get('/api/get/refugees?SearchQuery=' + query, { validateStatus: false })
    console.log("HULUFDIFDHFHF ", res)
    return res.data;
    // else fetch('api/get/camp?campID=' + id)
    //     .then(response => response.json())
    //     .then(response => {
    //         console.log(response)
    //         setUser(response);
    //     }).catch(error => console.log(error))
  }

  const { data: refsInfo, status, error, isLoading, refetch } = useQuery(["info"], getRefsFn, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: false
  })

  const subHandler = (e) => {
    e.preventDefault()
    refetch()
  }
  console.log(refsInfo)
  useEffect(() => {
    if (status == "success") setInfo(refsInfo)
  }, [status, refsInfo])

  return (
    // <div className="App">
    //   {info && <p>{JSON.stringify(info)}</p>}
    // </div>
    <div className='p-10 font-mono'>
      <h1 className='font-bold text-6xl p-10'>The Refugee Board</h1>
      <div className='text-center'>
        <form className='flex-row' onSubmit={subHandler}>
          <input placeholder="Search by Name, Camp, Address, Age and Country..." onChange={event => setQuery(event.target.value)} onClick={event => setActive(prev => !prev)} className={/*isActive ? 'border-black border-2 px-7 py-3 w-[80%]' :*/ 'border-black border px-7 py-3 w-[60%]'} />
          <button type='submit'><FcSearch className='text-center inline-block text-4xl' /></button>
        </form>
        {/* {JSON.stringify(Data)} */}
        {
          !isLoading && !(refsInfo?.error) && refsInfo?.length > 0 && <p className='bg-yellow-200 text-black w-[50%] px-3 py-2 mx-auto rounded-lg mt-6 font-mono'>Number of Refugees: {refsInfo.length}</p>
        }
        {!(refsInfo?.error) && <DataTable data={refsInfo} query={query} col={["Name", "Gender", "CampName", "CampAddress", "CountryOfOrigin", "Age", "Message", "MessageDate"]} deleteEntry={undefined} editEntry={undefined} />}
        {refsInfo?.error && <div className="p-2 my-10 mx-auto w-[60%] text-sm text-red-800 rounded-lg bg-red-100 dark:text-red-700 flex items-center justify-center" role="alert">
          <span className="font-medium">{refsInfo?.error}</span></div>}
      </div>
    </div>
  )
}

export default App
