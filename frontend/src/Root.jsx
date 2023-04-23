import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import AxFetch from './utils/axios'

import { useQuery } from "@tanstack/react-query"

// import AuthContextProvider from "./Hooks/AuthContext"

function Root() {
    const [info, setInfo] = useState(null); //All refugees
    const [user, setUser] = useState(null); //Camp Admin logged in
    const [campRefs, setCampRefs] = useState(null); //Refugees of a particular camp
    console.log('In the root')

    useEffect(() => {
        fetch('/api/get/all/refugees')
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setInfo(response);
            }).catch(error => console.log(error))
    }, [])


    const getUserFn = async () => {
        const data = await AxFetch.get('/api/getId');
        const { id } = data.data
        if (!id) {
            setUser(null);
            return ({ undefined: true })
        }
        else return AxFetch.get('api/get/camp?campID=' + id)
        // else fetch('api/get/camp?campID=' + id)
        //     .then(response => response.json())
        //     .then(response => {
        //         console.log(response)
        //         setUser(response);
        //     }).catch(error => console.log(error))
    }

    const { data, status, error, isFetching } = useQuery(["user"], getUserFn, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false
    })

    useEffect(() => {
        if (status == "success") setUser(data.data)
    }, [status, data])

    // useEffect(() => {
    //     // const id = localStorage.getItem("id");
    //     const { id } = await AxFetch.get('/api/getId');
    //     if (!id) setUser(null);
    //     else fetch('api/get/camp?campID=' + id)
    //         .then(response => response.json())
    //         .then(response => {
    //             console.log(response)
    //             setUser(response);
    //         }).catch(error => console.log(error))
    // }, [])

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
        <div className='text-center font-poppins'>
            <Navbar user={user} setUser={setUser} />
            <Outlet context={[info, setInfo, user, setUser, campRefs, setCampRefs]} />
        </div>

    )
}

export default Root
