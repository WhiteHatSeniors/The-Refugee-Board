import React from 'react'

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {

    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

    const nextPage = () => {
        if (currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const prevPage = () => {
        if (currentPage !== 1) setCurrentPage(currentPage - 1)
    }
    return (
        <nav className='my-14'>
            <ul className='inline-flex -space-x-px'>
                <li className="">
                    <button className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={prevPage}>
                        Previous
                    </button>
                </li>
                {pageNumbers.map(pgNumber => (
                    <li key={pgNumber}
                        className=''
                    >
                        {/* className="focus:ring-white focus:bg-black" > */}

                        <button onClick={() => setCurrentPage(pgNumber)}
                            className={` ${currentPage == pgNumber ? 'bg-black text-white px-3 py-2 border-none leading-none text-center' : 'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
                        >
                            {pgNumber}
                        </button>
                    </li>
                ))}
                <li className="">
                    <button className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={nextPage}>
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination