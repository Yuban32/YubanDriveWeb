import axios from "./axios"

/**
 * 文件夹API
 */
export const addFolderToRecycleAPI = async (folderUUID:any)=>{
    let data = await axios({
        url: "/folder/recycle",
        method: "POST",
        params:{
            folderUUID:folderUUID,
        }
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error)
    return data
}
export const getAllUserFolderAPI = async () => {
    let data = await axios({
        url: "/folderManagement/list",
        method: "GET",
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error)
    return data
}
export const createFolderAPI = async (folderUUID:any,folderName:any) =>{
    let data = await axios({
        url:"/folder/create",
        method:"POST",
        params:{
            folderUUID:folderUUID,
            newFolderName:folderName
        }
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error);
    return data;
}
export const renameFolderAPI = async (folderUUID:any,folderName:any) =>{
    let data = await axios({
        url:"/folder/rename",
        method:"POST",
        data:{
            currentFolderUUID:folderUUID,
            folderName:folderName
        }
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error);
    return data;
}