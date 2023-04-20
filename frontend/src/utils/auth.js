import AxFetch from "./axios";

async function signIn(email, password) {
    try{
        const response = await AxFetch.post(
            "/api/login",
            { CampEmail:email, password },
          );
          console.log({data:response.data.data,  status:response.status})
          return {data:response.data.data,  status:response.status}

    }catch({response}){
        return { error:response.data.error, status:response.status }
    }
}


async function register(email, password, name, address) {
    try{
        const response = await AxFetch.post(
            "/api/register",
            { CampEmail:email, password, CampName: name, CampAddress: address },
          );
          return {data:response.data.data,  status:response.status}

    }catch({response}){
        return { error:response.data.error, status:response.status }
    }
}

async function logout() {
    try{
        const response = await AxFetch.post(
            "/api/logout",
          );
          localStorage.removeItem("id")
          return {data:response.data.data,  status:response.status}

    }catch({response}){
        return { error:response.data.error, status:response.status }
    }
}


export { signIn, register, logout }