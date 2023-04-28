import AxFetch from "./axios";

async function getCamps(query) {
    try{
        const response = await AxFetch.get(`/api/get/camps?SearchQuery=${query}`)
          return {data:response.data.data,  status:response.status}

    }catch({response}){
        // console.log(response)
        return { error:response.data.error, status:response.status }
    }
}

async function verifyCamp(id) {
    try{
        const response = await AxFetch.patch(
            "/api/admin-verify",
            { id },
          );
          console.log({data:response.data.data,  status:response.status})
          return {data:response.data.data,  status:response.status}

    }catch({response}){
        return { error:response.data.error, status:response.status }
    }
}

async function deleteCamp(id) {
    try{
        const response = await AxFetch.delete(
            "/api/delete/camp/" + id,
          );
          console.log(response)
          console.log({data:response?.data?.data,  status:response?.status})
          return {data:response?.data?.data,  status:response?.status}

    }catch(data){

        console.log(data)
        return { error:data?.data?.error, status:data?.status }
    }
}

export { getCamps, verifyCamp, deleteCamp }