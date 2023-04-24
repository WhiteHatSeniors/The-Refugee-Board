import React from 'react'

function SucMessage({ children }) {
    return (
        <div className="p-2 my-10 mx-auto w-[50%] text-sm text-green-800 rounded-lg bg-green-200 dark:text-green-600" role="alert">
            <span className="font-medium">{children}</span></div>
    )
}

export default SucMessage