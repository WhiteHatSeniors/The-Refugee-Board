import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutlet, useOutletContext, useParams } from 'react-router-dom'
import { useQueryClient, useQuery, QueryClient, useMutation } from "@tanstack/react-query"
import AxFetch from '../utils/axios';
import SucMessage from '../components/SucMessage';
import ErrMessage from '../components/ErrMessage';

function EditEntry() {
    const { state } = useLocation();
    console.log(state)
    const [age, setAge] = useState("")
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [origin, setOrigin] = useState("")
    const [message, setMessage] = useState("")
    const [info, setInfo, user, setUser, campRefs, setCampRefs] = useOutletContext()
    // const [entry, setEntry] = useState(null)
    const location = useLocation();
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { id: pathId } = useParams();


    useEffect(() => {

        async function func() {
            console.log(user, location.pathname)
            const { state } = location
            console.log("STATE ", state)
            const data = await AxFetch.get('/api/getId');
            const { id } = data.data;
            if (location.pathname == '/edit-entry/' + pathId) {
                console.log('HAHAHHAHAHAHAH ', user)
                console.log(state, localStorage.getItem('id'))
                if (!(user?.CampID) && !localStorage.getItem('id')) navigate('/')
                else if (!(state?.CampID) || (state?.CampID != id)) navigate('/admin')
                setName(state?.Name)
                setAge(state?.Age)
                setGender(state?.Gender)
                setMessage(state?.Message)
                setOrigin(state?.CountryOfOrigin)
                //state.CampID would be undefined if a user enters the url directly as opposed to entering the edit button
                //if user is undefined then yhe's not authorized or if state.campID is there but if the id doesnt match the user id then again not auth
            }
        }

        func()

    }, [user])



    const editHelperFn = async (refData) => {
        const data = await AxFetch.get('/api/getId');
        const { id } = data.data
        console.log(data, id, "fdfdghffhdhfdhghdfg")
        //Checking if user is authorized
        if (!id) return setUser(null);
        else return AxFetch.patch(`/api/patch/refugee/${state?.RefugeeID}`, refData)
    }

    const { mutate: editMutation, data: editData, error: editError, isError } = useMutation(
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
                    setTimeout(() => {
                        navigate('/admin')
                    }, 2000)
                }
                // navigate('/');
                // console.log(queryClient.setQueryData(["camp-refugees"]))
                // const prevData = queryClient.getQueryData(['camp-refugees'])
                // console.log(prevData)
                // // console.log([...prevData, data?.data?.data])
                // // queryClient.setQueryData(['camp-refugees'], [data?.data?.data, ...prevData])
                // if (!(data?.error)) {
                //     queryClient.setQueryData(['camp-refugees'], (prev) => {
                //         console.log(prev)
                //         prev.error ? prev = [data?.data?.data] : prev.unshift(data?.data?.data)
                //         return prev
                //     })
                //     setInfo(prev => [data?.data?.data, ...prev])
                //     setCampRefs([data?.data?.data, ...prevData])
                // }
            },
            onError: (error) => {
                console.log(error.response.data.error)
            }
        });

    const editHandler = async (e) => {
        e.preventDefault()
        // setInfo()
        // setCampRefs((prev) => prev.filter(ele => ele.RefugeeID != id))
        await editMutation({
            Age: age, Name: name, Gender: gender, CountryOfOrigin: origin, Message: message
        })
        console.log("DATA ", editData)
        console.log("isErr ", isError)
        console.log("ERR ", editError)


        //----------------------------------------
        // try {
        //     e.preventDefault()
        //     const refInfo = {
        //         Age: age, Name: name, Gender: gender, CountryOfOrigin: origin, Message: message
        //     }
        //     console.log(info)
        //     const res = await fetch("/api/post/refugee", {
        //         method: "POST",
        //         headers: {
        //             "Content-type": "application/json",
        //         },
        //         body: JSON.stringify(refInfo),
        //     })
        //     const data = await res.json();
        //     setInfo([...info, refInfo])
        // } catch (err) {
        //     console.log(err)
        // }

    }


    return (
        <form onSubmit={editHandler} className='flex-row m-auto font-mono'>

            <h1 className='font-bold text-5xl p-10 underline mt-7'>Edit Refugee Details</h1>

            <label>
                <p className='w-[50%] mx-auto text-start mb-0'>Name</p>
                <input type="text" placeholder='Name' onChange={e => setName(e.target.value)} value={name} className='border-black 
            border mb-5 mt-2 w-[50%] block mx-auto' />
            </label>

            <label>
                <p className='w-[50%] mx-auto text-start mb-0'>Age</p>
                <input type="number" placeholder='Age' onChange={e => setAge(e.target.value)} value={age} className='border-black border mb-5 mt-2 w-[50%] block mx-auto' />
            </label>

            <label>
                <p className='w-[50%] mx-auto text-start mb-0'>Country Of Origin</p>
                <input type="text" placeholder='Country Of Origin' onChange={e => setOrigin(e.target.value)} value={origin} className='border-black border mb-5 mt-2 w-[50%] block mx-auto' />
            </label>

            <label>
                <p className='w-[50%] mx-auto text-start mb-0'>Message</p>
                <textarea placeholder='Message' onChange={e => setMessage(e.target.value)} value={message} className='border-black border mb-5 mt-2 w-[50%] block mx-auto' ></textarea>
            </label>

            <label>
                <p className='w-[50%] mx-auto text-start mb-0'>Gender:</p>
                <input type="text" placeholder="Gender" onChange={e => setGender(e.target.value)} value={gender} className='border-black border mb-5 mt-2 w-[50%] block mx-auto' />
            </label>

            <button type="submit" className='p-2 rounded-lg bg-yellow-200'>Submit</button>
            {isError && <ErrMessage>{editError?.response?.data?.error}</ErrMessage>}
            {editData && !isError && <SucMessage>Succesfully edited!</SucMessage>}
            {/* <p>Please select your favorite Web language:</p> */}
            {/* <input type="radio" id="html" name="fav_language" value="HTML" />
            <label for="html">HTML</label>
            <input type="radio" id="css" name="fav_language" value="CSS" />
            <label for="css">CSS</label>
            <input type="radio" id="javascript" name="fav_language" value="JavaScript" />
            <label for="javascript">JavaScript</label>
            <button type='submit'></button> */}
        </form>
    )
}

export default EditEntry