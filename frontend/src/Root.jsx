import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// import AuthContextProvider from "./Hooks/AuthContext"

function Root() {
    const [info, setInfo] = useState(null);
    const [user, setUser] = useState(null);
    const queryClient = new QueryClient()
    console.log('In the root')

    useEffect(() => {
        fetch('/api/get/all/refugees')
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setInfo(response);
            }).catch(error => console.log(error))
    }, [])

    useEffect(() => {
        const id = localStorage.getItem("id");
        console.log(id)
        if (!id) setUser(null);
        else fetch('api/get/camp?campID=' + id)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setUser(response);
            }).catch(error => console.log(error))
    }, [])

    // const fetchRefugees = async () => {
    //     const response = await AxFetch.get(
    //         "/api/get/all/refugees",
    //     );
    //     if (!response.ok) throw new Error("Couldnt load data:(", response);
    //     console.log(response)
    //     setInfo(response.data);
    //     return response
    // };

    // const {
    //     data,
    //     isLoading,
    //     isFetching,
    //     error,
    // } = useQuery(['refugees'], fetchRefugees, {
    //     refetchOnWindowFocus: false,
    //     retry: 2,
    // });

    return (
        <QueryClientProvider client={queryClient} >
            <div className='text-center font-poppins'>
                <Navbar user={user} setUser={setUser} />
                <Outlet context={[info, setInfo, user, setUser]} />
            </div>
            <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
    )
}

export default Root
