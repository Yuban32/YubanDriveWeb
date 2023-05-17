import axios from "./axios"


//test
export const mediaPlayerAPI = async (url:string)=>{
    let data = await axios({
        url: `/media/${url}`,
        method: "GET",
    }).then((res:any)=>{return res}).catch((error:any)=>error)
    return data
}