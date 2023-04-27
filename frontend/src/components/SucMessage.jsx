import React from 'react'

function SucMessage({ children }) {
    return (
        <div className="p-2 mt-7 mx-auto w-[60%] text-sm text-green-800 rounded-lg bg-green-50 dark:text-green-600" role="alert">
            <span className="font-medium">{children}</span></div>
    )
}

export default SucMessage