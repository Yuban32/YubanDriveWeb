import axios from "./axios"

/**
 * 回收站API
 */

//获取回收站内的数据
export const getRecycleListAPI = async () => {
    let data = await axios({
        url: "/recycle",
        method: "GET",
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error)
    return data
}

//将文件移动到回收站
export const removeFileToRecycleAPI = async (currentFolderUUID:string,fileName:string) =>{
    let data = await axios({
        url: "/recycle/file",
        method: "POST",
        params:{
            currentFolderUUID:currentFolderUUID,
            fileName:fileName
        }
    }).then((res:any)=>{return res.data}).catch((error:any)=>error)
    console.log(data);
    
    return data
}

//将文件夹移动到回收站
export const removeFolderToRecycleAPI = async (currentFolderUUID:any) => {
    let data = await axios({
        url: "/recycle/folder",
        method: "POST",
        params:{
            currentFolderUUID:currentFolderUUID,
        }
    }).then((res:any)=>{return res.data}).catch((error:any)=>error)
    return data
}

export const trashAPI = async (fileUUID:string) =>{
    let data = await axios({
        url: "/recycle/trash",
        method: "POST",
        params:{
            fileUUID:fileUUID,
        }
    }).then((res:any)=>{return res.data}).catch((error:any)=>error)
    return data

}

export const restoreAPI = async (fileUUID:string,type:string) =>{
    let data = await axios({
        url: "/recycle/restore",
        method: "POST",
        params:{
            fileUUID:fileUUID,
            type:type
        }
    }).then((res:any)=>{return res.data}).catch((error:any)=>error)
    return data
}