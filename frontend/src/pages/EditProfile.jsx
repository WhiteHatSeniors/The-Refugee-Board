import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useOutlet, useOutletContext, useParams } from 'react-router-dom'
import { useQueryClient, useQuery, QueryClient, useMutation } from "@tanstack/react-query"
import AxFetch from '../utils/axios';
import { deleteAcc } from '../utils/extras'
import SucMessage from '../components/SucMessage';
import ErrMessage from '../components/ErrMessage';

function EditProfile() {
    const { state } = useLocation();
    console.log(state)
    const [campAddress, setCampAddress] = useState("")
    const [name, setName] = useState("")
    const [info, setInfo, user, setUser, campRefs, setCampRefs] = useOutletContext()
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
            if (location.pathname == '/edit-profile') {
                console.log('HAHAHHAHAHAHAH ', user)
                console.log(state, localStorage.getItem('id'))
                if (!(user?.CampID) && !localStorage.getItem('id')) navigate('/')
                else if (user?.CampID != id) navigate('/camp-dashboard')
                setName(user?.CampName)
                setCampAddress(user?.CampAddress)
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
        else return AxFetch.patch(`/api/patch/camp`, refData)
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
                    console.log(user)
                    setUser(data.data.data)
                    setTimeout(() => {
                        navigate('/camp-dashboard')
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
            CampName: name, CampAddress: campAddress
        })
        console.log("DATA ", editData)
        console.log("isErr ", isError)
        console.log("ERR ", editError)

    }


    return (
        <form onSubmit={editHandler} className='flex-row m-auto font-mono'>

            <h1 className='font-bold text-5xl p-10 underline mt-7'>Edit Camp Details</h1>

            {user?.CampEmail && <p className='mx-auto w-[50%] text-start my-6'><span className='underline'>Camp Email:</span>  {user?.CampEmail}</p>}
            {!(isNaN(user?.NumberOfRefugees)) && <p className='mx-auto w-[50%] text-start my-6'><span className='underline'>Number of Refugees:</span>  {user?.NumberOfRefugees}</p>}
            {user?.created_at && <p className='mx-auto w-[50%] text-start my-6'><span className='underline'>Created at: </span>  {user?.created_at}</p>}

            <label>
                <p className='w-[50%] mx-auto text-start mb-0'>Name</p>
                <input type="text" placeholder='Name' onChange={e => setName(e.target.value)} value={name} className='border-black 
            border mb-5 mt-2 w-[50%] block mx-auto' />
            </label>

            <label>
                <p className='w-[50%] mx-auto text-start mb-0'>Camp Address</p>
                <input type="text" placeholder='Camp Address' onChange={e => setCampAddress(e.target.value)} value={campAddress} className='border-black border mb-5 mt-2 w-[50%] block mx-auto' />
            </label>
            <button type="submit" className='py-2 px-4 mt-4 rounded-lg bg-yellow-200 hover:bg-yellow-300'>Edit</button>
            <Link className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 mx-3" type='button' onClick={async (e) => {
                // e.preventDefault()
                try {
                    const con1 = confirm("Do you want to delete the camp?")
                    if (con1) {
                        const con2 = confirm("This action is irreversible. Are you sure you want to delete the Camp?")
                        if (con2) {
                            await deleteAcc();
                            setUser(null)
                            navigate('/')
                        }

                    }
                } catch (err) {
                    console.log(err)
                }

            }} >Delete Camp</Link>
            {isError && <ErrMessage>{editError?.response?.data?.error}</ErrMessage>}
            <Link to='/change-password' className='underline block text-blue-700 my-5'>Change Password</Link>
            {editData && !isError && <SucMessage>Succesfully edited!</SucMessage>}
        </form>
    )
}

export default EditProfile