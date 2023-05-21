import axios from "./axios"
const checkServersStatusAPI = async ()=>{
    return await axios({
        url: "/check-servers-status",
        method: "GET",
    })
}
export default checkServersStatusAPI

