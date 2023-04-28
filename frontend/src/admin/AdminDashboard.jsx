import { useEffect, useState } from 'react'
import { FcSearch } from 'react-icons/fc';
import DataTable from '../components/DataTable';
import { useLocation, useNavigate } from 'react-router-dom';
import AxFetch from '../utils/axios';
import { deleteCamp, getCamps, verifyCamp } from '../utils/admin';
import ErrMessage from '../components/ErrMessage';
import { adminLogout } from '../utils/auth';

// For Future Use:
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function AdminDashboard() {
    const [isActive, setActive] = useState(false)
    const [query, setQuery] = useState("")
    const location = useLocation();
    const navigate = useNavigate()
    const [camps, setCamps] = useState({});
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        async function func() {
            console.log("HAHAHAHA")
            const data = await AxFetch.get('/api/getAdminId');
            const { id } = data.data;
            if (location.pathname == '/admin-dashboard') {
                if (id == undefined) navigate('/admin-login')
            }
        }

        func()
    }, [])

    useEffect(() => {
        async function func() {
            setIsLoading(true)
            const data = await getCamps(query)
            console.log(data)
            setCamps(data)
            setIsLoading(false)
            // setTimeout(() => {
            //     // queryClient.setQueryData(['User'], data)
            //     setIsLoading(false)
            //     // navigate('/admin-dashboard')
            // }, 1500)
        }
        func()

    }, [])



    const deleteEntry = async (refId) => {
        const data = await AxFetch.get('/api/getAdminId');
        const { id } = data.data
        if (!id) navigate('/admin-login')
        const boolDelete = confirm("Do you want to delete the camp?");
        if (boolDelete) {
            // const data = await adminSignIn(username, pw)
            const data = await deleteCamp(refId)
            console.log(data)
            setCamps(prev => {
                prev.data.filter((el) => el.CampID != refId);
                return prev;
            })
            // setCamps(data)
            // setTimeout(() => {
            //     // queryClient.setQueryData(['User'], data)
            //     setIsLoading(false)
            //     // navigate('/admin-dashboard')
            // }, 1500)
        }

    }


    // const verifyHelperFn = async (campData) => {
    //     const data = await AxFetch.get('/api/getAdminId');
    //     const { id } = data.data
    //     if (!id) navigate('/admin-login')
    //     else return AxFetch.patch(`/api/admin-verified`, campData)
    // }

    // const { mutate: verifyMutation } = useMutation(
    //     verifyHelperFn, //mutationFn
    //     {
    //         onSuccess: async (data) => {
    //             console.log(data.data.data)
    //             if (!(data?.error)) {
    //                 console.log(data.data.data)
    //                 setTimeout(() => {
    //                     navigate('/admin-dashboard')
    //                 }, 2000)
    //             }
    //         },
    //         onError: (error) => {
    //             console.log(error.response.data.error)
    //         }
    //     });

    const verifyEntry = async (campId) => {
        const data = await AxFetch.get('/api/getAdminId');
        const { id } = data.data
        if (!id) navigate('/admin-login')
        const boolVerify = confirm("Do you want to approve the camp entry?");
        if (boolVerify)
            if (boolVerify) {
                // const data = await adminSignIn(username, pw)
                const data = await verifyCamp(campId)
                setCamps(prev => {
                    prev.data.find((el) => el.CampID == campId).verified = 1;
                    return prev;
                })
                console.log(data)
                // setCamps(data)
                // setTimeout(() => {
                //     // queryClient.setQueryData(['User'], data)
                //     setIsLoading(false)
                //     // navigate('/admin-dashboard')
                // }, 1500)
            }
    }

    const subHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const data = await getCamps(query)
        console.log(data)
        setCamps(data)
        setIsLoading(false)
    }

    return (
        // <div className="App">
        //   {info && <p>{JSON.stringify(info)}</p>}
        // </div>
        <div className='p-10 bg-yellow-50 min-h-screen'>
            <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 font-medium rounded-lg text-md px-5 py-2.5 mt-8 dark:bg-red-600 dark:hover:bg-red-700 mx-auto font-mono text-center" onClick={async (e) => {
                e.preventDefault()
                try {
                    await adminLogout();
                    setCamps({})
                    navigate('/admin-login')
                } catch (err) {
                    console.log(err)
                }

            }} >Logout</button>
            <h1 className='font-bold font-mono text-6xl my-10 text-center p-10'>The Admin Dashboard</h1>
            <div className='text-center'>
                <form className='flex-row' onSubmit={subHandler}>
                    <input placeholder="Search by Name, Camp, Address, Age and Country..." onChange={event => setQuery(event.target.value)} onClick={event => setActive(prev => !prev)} className={/*isActive ? 'border-black border-2 px-7 py-3 w-[80%]' :*/ 'border-black border px-7 py-3 w-[60%] font-mono'} />
                    <button type='submit'><FcSearch className='text-center inline-block text-4xl' /></button>
                </form>

                {
                    !isLoading && !(camps?.error) && camps?.data?.length > 0 && <p className='bg-yellow-200 text-black w-[50%] px-3 py-2 mx-auto rounded-lg mt-6 font-mono hover:bg-yellow-300'>Number of Camps: {camps.data.length}</p>
                }
                {/* {JSON.stringify(Data)} */}
                {
                    !isLoading && !(camps?.error) && <DataTable data={camps?.data} col={["CampID", "CampName", "CampAddress", "NumberOfRefugees", "CampEmail", "created_at"]} query={query} deleteEntry={deleteEntry == undefined ? '' : deleteEntry} editEntry={undefined} verifyEntry={verifyEntry == undefined ? '' : verifyEntry} />
                }
                {
                    !isLoading && (camps?.error || camps?.data?.length == 0) && <ErrMessage>
                        {camps?.error ? camps.error : "No camps found"}
                    </ErrMessage>
                }

            </div>
        </div>
    )
}
// IoCreate IoIosCreate FaPlusSquare FaPlusCircle

export default AdminDashboard
