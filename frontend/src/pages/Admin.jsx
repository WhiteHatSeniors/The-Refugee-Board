import { useEffect, useState } from 'react'
import { FcSearch } from 'react-icons/fc';
// import Data from "../mock-data.json"
import DataTable from '../components/DataTable';
import { useNavigate, useOutletContext } from 'react-router-dom';

function Admin() {
    const [isActive, setActive] = useState(false)
    const [query, setQuery] = useState("")
    const [info, setInfo] = useOutletContext()

    const navigate = useNavigate()

    // useEffect(() => {
    //     fetch('http://127.0.0.1:5000/api/get/all/refugees')
    //         .then(response => response.json())
    //         .then(response => {
    //             console.log(response)
    //             setInfo(response);
    //         })
    //         .catch(error => console.log(error))

    // }, [])

    const editEntry = (id) => {
        // fetch('http://127.0.0.1:5000/api/update/refugee')
        console.log('Editing ' + id)
    }

    const deleteEntry = async (id) => {
        fetch(`http://127.0.0.1:5000/api/delete/refugee/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            }
        })
            .then(response => response.json())
            .then(response => {
                setInfo((prev) => prev.filter(ele => ele.RefugeeID != id))
            })
            .catch(error => console.log(error))
    }


    return (
        // <div className="App">
        //   {info && <p>{JSON.stringify(info)}</p>}
        // </div>
        <div className='p-10'>
            <h1 className='font-bold text-6xl p-10'>The Admin Dashboard</h1>
            <div className='text-center'>
                <div className='flex-row'>
                    <button className='bg-green-500 p-1 rounded-xl m-4' onClick={(e) => navigate('/create-entry')}>Create Entry</button>
                    <input placeholder="Enter name" onChange={event => setQuery(event.target.value)} onClick={event => setActive(prev => !prev)} className={isActive ? 'border-black border-2 px-7 py-3 w-[80%]' : 'border-black border-y px-7 py-3 w-[60%]'} />
                    <FcSearch className='text-center inline-block text-4xl ' />
                </div>
                {/* {JSON.stringify(Data)} */}
                {
                    info && <DataTable data={info} query={query} deleteEntry={deleteEntry == undefined ? '' : deleteEntry} editEntry={editEntry == undefined ? '' : editEntry} />
                }
                {
                    !info && <h1>No data for now:(</h1>
                }

            </div>
        </div>
    )
}

export default Admin
