import { useEffect, useState } from 'react'
import { FcSearch } from 'react-icons/fc';
// import Data from "../mock-data.json"
import DataTable from '../components/DataTable';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useQueryClient, useQuery, QueryClient, useMutation } from "@tanstack/react-query"
import AxFetch from '../utils/axios';

function Admin() {
    const [isActive, setActive] = useState(false)
    const [query, setQuery] = useState("")
    const [info, setInfo, user, setUser, campRefs, setCampRefs] = useOutletContext()
    const location = useLocation();
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    useEffect(() => {
        // console.log(user, location.pathname)
        if (location.pathname == '/admin') {
            // console.log('HAHAHHAHAHAHAH ', user)
            if (!(user?.CampID) && !(localStorage.getItem("id"))) navigate('/')
        }
    }, [user])

    // useEffect(() => {
    //     fetch('http://127.0.0.1:5000/api/get/all/refugees')
    //         .then(response => response.json())
    //         .then(response => {
    //             console.log(response)
    //             setInfo(response);
    //         })
    //         .catch(error => console.log(error))

    // }, [])

    const getRefByCampId = async () => {
        const data = await AxFetch.get('/api/getId');
        const { id } = data.data
        console.log(data, id, "fdfdghffhdhfdhghdfg")
        if (!id) return setUser(null);
        const refs = await AxFetch.get('api/get/refugees?CampID=' + id)
        console.log(refs)
        return refs?.data
    }

    const { status, isFetching, isLoading, error, data: campRefugees } = useQuery(
        ['camp-refugees'],
        getRefByCampId, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: false
    }
    )

    useEffect(() => {
        console.log(campRefugees)
        if (status == "success") setCampRefs(campRefugees)
    }, [status, campRefugees?.data])


    const editEntry = (id) => {
        // fetch('http://127.0.0.1:5000/api/update/refugee')
        console.log('Editing ' + id)
    }

    const deleteHelperFn = async (refId) => {
        const data = await AxFetch.get('/api/getId');
        const { id } = data.data
        console.log(data, id, "fdfdghffhdhfdhghdfg")
        //Checking if user is authorized
        if (!id) return setUser(null);
        else return AxFetch.delete(`/api/delete/refugee/${refId}`)
    }

    const { mutate: deleteMutation } = useMutation(
        deleteHelperFn, //mutationFn
        {
            onMutate: async (id) => {
                await queryClient.cancelQueries(["camp-refugees"])
                console.log(queryClient.getQueriesData(["camp-refugees"]))
                queryClient.setQueryData(["camp-refugees"], (prevData) => prevData.filter(ele => ele.RefugeeID != id))
            },
            onSuccess: (data) => {
                console.log(data)
                // navigate('/');
                // queryClient.setQueryData(['camp-refugees'],  )
            },
            onError: (error) => {
                console.log(error)
            }
        });


    const deleteEntry = async (id) => {

        // setInfo((prev) => prev.filter(ele => ele.RefugeeID != id))
        setCampRefs((prev) => prev.filter(ele => ele.RefugeeID != id))
        deleteMutation(id)

        // try {
        //     await AxFetch.delete(`/api/delete/refugee/${id}`)
        //         ((prev) => prev.filter(ele => ele.RefugeeID != id))
        // } catch (err) {
        //     console.log(err)
        // }


        // fetch(`/api/delete/refugee/${id}`, {
        //     method: "DELETE",
        //     credentials: "include"

        // })
        //     .then(response => response.json())
        //     .then(response => {
        //         setInfo((prev) => prev.filter(ele => ele.RefugeeID != id))
        //     })
        //     .catch(error => console.log(error))
    }


    return (
        // <div className="App">
        //   {info && <p>{JSON.stringify(info)}</p>}
        // </div>
        <div className='p-10'>
            <h1 className='font-bold text-6xl p-10'>The Admin Dashboard</h1>
            <div className='text-center'>
                <div className='flex-row'>
                    <button className='bg-green-500 p-1 rounded-xl m-4' onClick={(e) => navigate('/create-entry')}>Create Entry</button>
                    <input placeholder="Enter name" onChange={event => setQuery(event.target.value)} onClick={event => setActive(prev => !prev)} className={/*isActive ? 'border-black border-2 px-7 py-3 w-[80%]' :*/ 'border-black border-y px-7 py-3 w-[60%]'} />
                    <FcSearch className='text-center inline-block text-4xl ' />
                </div>
                {/* {JSON.stringify(Data)} */}
                {
                    campRefugees && <DataTable data={campRefugees} col={["Name", "Gender", "CountryOfOrigin", "Age", "Message", "MessageDate"]} query={query} deleteEntry={deleteEntry == undefined ? '' : deleteEntry} editEntry={editEntry == undefined ? '' : editEntry} />
                }
                {
                    !campRefugees && <h1>No data for now:(</h1>
                }

            </div>
        </div>
    )
}

export default Admin
