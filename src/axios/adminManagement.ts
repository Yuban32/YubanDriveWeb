import axios from "./axios"

//后台管理API集合

//获取所有用户的存储文件
export const StorageListAPI = async () => {
    let data = await axios({
        url: "/admin-management/storage-list",
        method: "GET",
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error)
    return data
}

//管理员获取用户列表
export const getUserList = async () => {
    let data = await axios({
        url: "/admin-user-management/userList",
        method: "GET",
    }).then((res: any) => { return res.data.data }).catch((error: any) => error)
    return data
}
//管理员编辑用户列表
export const AdminUserEdit = async (params: String) => {
    let data = await axios({
        url: "/admin-user-management/edit",
        method: "POST",
        data: params,
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res: any) => { return res.data }).catch((error: any) => error)
    return data;
}
//管理员删除用户
export const userDelete = async (params: String) => {
    let data = await axios({
        url: "/admin-user-management/delete",
        method: "POST",
        data: params,
        headers: {
            "Content-Type": "application/json"
        }
    }).then((res: any) => { return res.data }).catch((error: any) => error)
    return data;
}