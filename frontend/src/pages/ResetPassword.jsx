import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutlet, useOutletContext, useParams } from 'react-router-dom'
import { useQueryClient, useQuery, QueryClient, useMutation } from "@tanstack/react-query"
import AxFetch from '../utils/axios';
import SucMessage from '../components/SucMessage';
import ErrMessage from '../components/ErrMessage';

function ChangePw() {
    const { state } = useLocation();
    console.log(state)
    const [pw, setPw] = useState("")
    const [cpw, setCpw] = useState("")
    const [info, setInfo, user, setUser, campRefs, setCampRefs] = useOutletContext()
    const { id: hash } = useParams();

    const location = useLocation();
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    console.log(state, state?.user)

    useEffect(() => {

        async function func() {
            console.log(user, location.pathname)
            const { state } = location
            console.log("STATE ", state)
            const data = await AxFetch.get('/api/getId');
            const { id } = data.data;
            if (location.pathname == '/reset-password/' + hash) {
                if (id != undefined) navigate('/camp-dashboard')
            }
        }

        func()

    }, [user?.CampID])



    const editHelperFn = async (refData) => {
        const data = await AxFetch.get('/api/getId');
        const { id } = data.data
        console.log(data, id, "fdfdghffhdhfdhghdfg")
        //Checking if user is authorized
        if (id) return setUser(null);
        else return AxFetch.patch(`/api/reset/${hash}`, refData)
    }

    const { mutate: editMutation, data: editData, error: editError, isError, isLoading } = useMutation(
        editHelperFn, //mutationFn
        {
            // onMutate: async () => {
            //     await queryClient.cancelQueries(["camp-refugees"])
            //     queryClient.setQueryData(["camp-refugees"], (prev) => prev.filter(ele => ele.RefugeeID != id))
            // },
            onSuccess: async (data) => {
                console.log(data.data.data)
                // return queryClient.invalidateQueries(["camp-refugees"]);
                if (!(data?.error)) {
                    console.log(user)
                    setTimeout(() => {
                        navigate('/login')
                    }, 2000)
                }
            },
            onError: (error) => {
                console.log(error.response.data.error)
            }
        });

    const editHandler = async (e) => {
        e.preventDefault()
        await editMutation({
            password: pw, ConfirmPassword: cpw
        })
        console.log("DATA ", editData)
        console.log("isErr ", isError)
        console.log("ERR ", editError)

    }


    return (
        <form onSubmit={editHandler} className='flex-row m-auto font-mono' autoComplete="off">

            <h1 className='font-bold text-5xl p-10 underline mt-7'>Reset Password</h1>
            {/* <label> */}
            {/* <p className='w-[50%] mx-auto text-start mb-0'>Password</p> */}
            <input type="password" placeholder='New Password' onChange={e => setPw(e.target.value)} value={pw} className='border-black 
            border mb-5 mt-2 w-[30%] block mx-auto' autoComplete="new-password" />
            {/* </label> */}

            {/* <label> */}
            {/* <p className='w-[50%] mx-auto text-start mb-0'>Confirm Password</p> */}
            <input type="password" placeholder='Confirm Password' onChange={e => setCpw(e.target.value)} value={cpw} className='border-black border mb-5 mt-2 w-[30%] block mx-auto' />
            {/* </label> */}
            <p className='text-gray-600 text-sm mb-10'>Note: Check your spam folder if not found in primary inbox</p>
            <button type="submit" className='py-2 px-4 mt-2 rounded-lg bg-yellow-200 hover:bg-yellow-300'>{isLoading ? "Loading.." : "Edit"}</button>
            {isError && <ErrMessage>{editError?.response?.data?.error}</ErrMessage>}
            {editData && !isError && <SucMessage>Password changed!</SucMessage>}
        </form>
    )
}

export default ChangePw