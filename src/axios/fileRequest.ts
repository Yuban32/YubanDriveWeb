import axios from './axios'
interface checkFile{
    md5:string,
    folderUUID:string,
    fileName:string
}
/**
 * 文件API
 */

export const getFileListAPI = async(param:String) =>{
    let data = await axios({
        url: "/fileDownload/fileList",
        method: "GET",
        params: {
            parentFolderUUID: param
        }
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error)
    return data
}
export const getRecycleFileListAPI = async() =>{
    let data = await axios({
        url: "/fileDownload/recycle",
        method: "GET",
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error)
    return data
}

export const uploadFileAPI = async(param:FormData) =>{
    return await axios({
        url:"/fileUpload/chunk",
        method:"POST",
        data:param
    })
}
export const uploadFileCheckAPI = async(param:checkFile) =>{
    let data = await axios({
        url:"/fileUpload/check",
        method:"GET",
        params:{
            md5:param.md5,
            folderUUID:param.folderUUID,
            fileName:param.fileName
        }
    }).then((res:any)=>{return res.data}).catch((error:any)=>error)
    return data;
}

//文件管理

export const getAllUserFileListAPI = async() =>{
    let data = await axios({
        url: "/fileManagement/list",
        method: "GET",
    }).then((res:any)=>{return res.data.data}).catch((error:any)=>error)
    return data
}

export const renameFileAPI = async (newFileName:string,currentFileName:object,folderUUID:string) =>{
    let data = await axios({
        url:"/fileManagement/rename",
        method:"POST",
        params:{
            newFileName:newFileName,
            currentFileName:currentFileName,
            folderUUID:folderUUID
        }
    }).then((res:any)=>{return res.data}).catch((error:any)=>error)
    return data;
}