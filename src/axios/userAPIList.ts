import axios from "./axios"
/**
 * 用户API
 */
export const login = async (params: String) => {
    return await axios({
        url: "/user/login",
        method: "POST",
        data: params,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

//用户退出
export const logout = async () => {
    let data = await axios({
        url: "/user/logout",
        method: "GET"
    }).then((res:any)=>{return res.data})
    //退出成功的话,就清空本地的JWT Token并刷新页面
    if(data.code == 200){
        localStorage.removeItem("Authorization")
        localStorage.removeItem("userData")
        location.reload()
    }
    return data
}
//用户注册
export const register = async (params: String) => {
    return await axios({
        url: "/user/register",
        method: "POST",
        data: params,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
//获取当前用户信息
export const getUserInfo = async () => {
    let data = await axios({
        url: "/user",
        method: "GET"
    }).then((res: any) => { return res.data.data }).catch((error: any) => error)
    return data;
}

//用户编辑信息
export const UserEdit = async (params: String) => {
    let data = await axios({
        url: "/user/edit",
        method: "POST",
        data: params,
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res: any) => { return res.data }).catch((error: any) => error)
    return data;
}