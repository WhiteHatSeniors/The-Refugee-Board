import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutlet, useOutletContext } from 'react-router-dom'
import { useQueryClient, useQuery, QueryClient, useMutation } from "@tanstack/react-query"
import AxFetch from '../utils/axios';

function CreateEntry() {
    const [age, setAge] = useState(null)
    const [name, setName] = useState(null)
    const [gender, setGender] = useState(null)
    const [origin, setOrigin] = useState(null)
    const [message, setMessage] = useState(null)
    const [info, setInfo, user, setUser, campRefs, setCampRefs] = useOutletContext()
    const [entry, setEntry] = useState(null)
    const location = useLocation();
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    useEffect(() => {
        console.log(user, location.pathname)
        if (location.pathname == '/create-entry') {
            console.log('HAHAHHAHAHAHAH ', user)
            if (!(user?.CampID)) navigate('/')
        }
    }, [user])



    const createHelperFn = async (refData) => {
        const data = await AxFetch.get('/api/getId');
        const { id } = data.data
        console.log(data, id, "fdfdghffhdhfdhghdfg")
        //Checking if user is authorized
        if (!id) return setUser(null);
        else return AxFetch.post(`/api/post/refugee`, refData)
    }

    const { mutate: createMutation } = useMutation(
        createHelperFn, //mutationFn
        {
            // onMutate: async () => {
            //     await queryClient.cancelQueries(["camp-refugees"])
            //     queryClient.setQueryData(["camp-refugees"], (prev) => prev.filter(ele => ele.RefugeeID != id))
            // },
            onSuccess: (data) => {
                console.log(data.data.data)
                // navigate('/');
                // console.log(queryClient.setQueryData(["camp-refugees"]))
                const prevData = queryClient.getQueryData(['camp-refugees'])
                console.log(prevData)
                console.log([...prevData, data?.data?.data])
                // queryClient.setQueryData(['camp-refugees'], [data?.data?.data, ...prevData])
                queryClient.setQueryData(['camp-refugees'], (prev) => {
                    prev.unshift(data?.data?.data)
                    console.log(prev)
                    return prev
                })
                setInfo(prev => [data?.data?.data, ...prev])
                setCampRefs([data?.data?.data, ...prevData])
            },
            onError: (error) => {
                console.log(error)
            }
        });

    const subHandler = async (e) => {
        e.preventDefault()
        // setInfo()
        // setCampRefs((prev) => prev.filter(ele => ele.RefugeeID != id))
        createMutation({
            Age: age, Name: name, Gender: gender, CountryOfOrigin: origin, Message: message
        })
        navigate('/admin')
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
        <form onSubmit={subHandler} className='flex-row text-center m-auto'>
            <h1 className='font-bold text-5xl p-10 underline mt-7'>Refugee Entry</h1>
            <input type="text" placeholder='Name' onChange={e => setName(e.target.value)} className='border-black border m-5 w-[50%] block mx-auto' />
            <input type="number" placeholder='Age' onChange={e => setAge(e.target.value)} className='border-black border m-5 w-[50%] block mx-auto' />
            <input type="text" placeholder='Country of origin' onChange={e => setOrigin(e.target.value)} className='border-black border m-5 w-[50%] block mx-auto' />
            <textarea placeholder='Message' onChange={e => setMessage(e.target.value)} className='border-black border m-5 w-[50%] block mx-auto' ></textarea>
            <input type="text" placeholder="Gender" onChange={e => setGender(e.target.value)} className='border-black border m-5 w-[50%] block mx-auto' />
            <button type="submit" className='p-2 rounded-lg bg-yellow-200'>Submit</button>
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

export default CreateEntry