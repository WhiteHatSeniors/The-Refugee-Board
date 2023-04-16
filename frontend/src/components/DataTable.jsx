import React from 'react'

function capitalizeFirstLetter(str) {

    // converting first letter to uppercase
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

    return capitalized;
}


const ThData = ({ column }) => column.map((data, id) => <th key={data} className='p-5'>{capitalizeFirstLetter(data.replace(/([A-Z])/g, ' $1').trim())}</th>)

const TdData = ({ data, column }) => {

    return data.map((data, id) => {
        return (
            <tr key={Math.random()}>
                {
                    column.map((v) => {
                        return <td className='p-5' key={data[v]} >{data[v] === "" ? "none" : data[v]}</td>
                    })
                }
                <button className='bg-red-600 p-1 m-2 rounded-xl' onClick={(e) => deleteEntry && deleteEntry(data[ind].RefugeeID)}>Delete</button><button className='bg-green-500 p-1 m-2 rounded-xl' onClick={(e) => editEntry && editEntry(data[ind].RefugeeID)}>edit</button>
            </tr>
        )
    })
}

export default function DataTable({ data, query, deleteEntry, editEntry }) {
    let column = Object.keys(data[0]);
    column = column.filter(el => (el != "RefugeeID" && el != "CampID"))

    console.log(data)

    return (
        <table className="table text-center mx-auto border-black border-4 my-16">
            <thead className='border-b-black border-2'>
                <tr><ThData column={column} /></tr>
            </thead>
            <tbody>
                <TdData data={data} column={column} deleteEntry={deleteEntry} editEntry={editEntry} />
            </tbody>
        </table>
    )
}
// data.map((post, index) => (
//     <div key={index}>
//         <p>{post.Name}</p>
//         <p>{post.Age}</p>
//     </div>
// ))