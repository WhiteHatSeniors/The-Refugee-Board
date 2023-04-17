import React, { useState } from 'react'
import Pagination from './Pagination';


function capitalizeFirstLetter(str) {

    // converting first letter to uppercase
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

    return capitalized;
}


const ThData = ({ column }) => column.map((data, id) => <th key={id} className='p-5'>{capitalizeFirstLetter(data.replace(/([A-Z])/g, ' $1').trim())}</th>)

const TdData = ({ data, column, deleteEntry, editEntry }) => {
    if (data) {
        console.log(data)
        console.log(column)
        return data.map((data, id) => {
            return (
                <tr key={id}>
                    {
                        column.map((v, ind) => {
                            return <td className='p-5' key={ind} >{data[v] === "" ? "none" : data[v]}</td>
                        })
                    }
                    {deleteEntry && <td><button className='bg-red-600 p-1 m-2 rounded-xl' onClick={(e) => deleteEntry(data.RefugeeID)}>Delete</button></td>}
                    {editEntry && <td><button className='bg-green-500 p-1 m-2 rounded-xl' onClick={(e) => editEntry(data.RefugeeID)}>edit</button></td>}
                </tr>
            )
        })
    }

}



export default function DataTable({ data, query, deleteEntry, editEntry }) {
    // console.log(data)

    // User is currently on this page
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 7;
    const nPages = !data ? 0 : Math.ceil(data.length / recordsPerPage);
    console.log(data)

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = !data ? "" : data.slice(indexOfFirstRecord, indexOfLastRecord);


    console.log(data)
    if (data) {
        let column = Object.keys(data[0]);
        column = column.filter(el => (el != "RefugeeID" && el != "CampID"))
        return (
            <div>
                <table className="table text-center mx-auto border-black border-4 my-16">
                    <thead className='border-b-black border-2'>
                        <tr><ThData column={column} /></tr>
                    </thead>
                    <tbody>
                        <TdData data={currentRecords} column={column} deleteEntry={deleteEntry} editEntry={editEntry} />
                    </tbody>
                </table>
                < Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>
        )
    }
    else return <p className='text-red-500'>No information for now</p>

}
// data.map((post, index) => (
//     <div key={index}>
//         <p>{post.Name}</p>
//         <p>{post.Age}</p>
//     </div>
// ))