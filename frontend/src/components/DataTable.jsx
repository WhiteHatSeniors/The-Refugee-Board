import React, { useState } from 'react'
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaCheckCircle } from "react-icons/fa";

// const col = ["Name", "Gender", "CampName", "CountryOfOrigin", "Age", "Message", "MessageDate"]

//DataTable: Component to display data as a table

//Will return a string whose first letter is capitalized
function capitalizeFirstLetter(str) {

    // converting first letter to uppercase
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

    return capitalized.replace("_", " ");
}


//Table Headings
const ThData = ({ column }) => column.map((data, id) => <th key={id} className='p-5'>{capitalizeFirstLetter(data.replace(/([A-Z])/g, ' $1').trim())}</th>)

//Table data(body/rows)
const TdData = ({ data, column, deleteEntry, editEntry, verifyEntry }) => {
    if (data) {
        return data.map((data, id) => {
            return (
                <tr key={id}>
                    {
                        column.map((v, ind) => {
                            return <td className='p-5' key={ind} >{data[v] === "" ? "none" : data[v]}</td>
                        })
                    }
                    {
                        editEntry && <td><Link title='Edit entry' type='button' to={`/edit-entry/${data.RefugeeID}`} state={data}><button className="text-green-700 hover:btextgreen-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-center mx-3 dark:text-green-600 dark:hover:text-green-700 dark:focus:ring-green-800"><FaEdit /></button></Link></td>}
                    {deleteEntry && <td><button title='Delete entry' className="text-red-700 hover:text-red-800 font-medium rounded-full mx-3 pr-2 dark:text-red-600 dark:hover:text-red-700 dark:focus:ring-red-900" onClick={(e) => deleteEntry(data.CampID)}><FaTrash /></button></td>}
                    {!data.verified && verifyEntry && <td><button title='Verify entry' className="text-green-700 hover:text-green-800 font-medium rounded-full mx-3 pr-2 dark:text-green-600 dark:hover:text-green-700 dark:focus:ring-green-900" onClick={(e) => verifyEntry(data.CampID)}><FaCheckCircle /></button></td>}
                </tr>
                // className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-3 py-2.5 text-center mr-3 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            )
        })
    }

}


//DataTable combines ThData and TdData and uses pagination and state management to keep track of the pages
export default function DataTable({ data, query, deleteEntry, editEntry, col, verifyEntry }) {

    // User is currently on this page
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const nPages = !data ? 0 : Math.ceil(data.length / recordsPerPage);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = !data ? "" : data.slice(indexOfFirstRecord, indexOfLastRecord);

    if (data && data.length > 0) {
        let column = Object.keys(data[0]);
        column = column.filter(el => (el != "RefugeeID" && el != "CampID"))
        return (
            <div>
                <table className="table text-center mx-auto border-black border-4 my-16">
                    <thead className='border-b-black border-2'>
                        <tr><ThData column={col} /></tr>
                    </thead>
                    <tbody>
                        <TdData data={currentRecords} column={col} deleteEntry={deleteEntry} editEntry={editEntry} verifyEntry={verifyEntry} />
                    </tbody>
                </table>
                < Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>
        )
    }
    // else return <p className='text-red-500'>No information for now</p>

}
