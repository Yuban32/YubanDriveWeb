import axios from "./axios"

/**
 * 用户API
 */

export const login = async(param:String) =>{
    return await axios({
        url:"/user/login",
        method:"POST",
        data:param,
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const logout = async() =>{
    return await axios({
        url:"/user/logout",
        method:"GET"
    })
}

export const register = async(param:String) =>{
    return await axios({
        url:"/user/register",
        method:"POST",
        data:param,
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export const getUserInfo = async() =>{
    let data = await axios({
        url:"/user",
        method:"GET"
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error)
    return data;
}
export const getUserList = async()=>{
    let data = await axios({
        url: "/user/userList",
        method: "GET",
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error)
    return data
}