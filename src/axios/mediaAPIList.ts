export const mediaPlayerAPI = async (md5:string)=>{
    return `http://localhost:5000/media/${md5}`
}