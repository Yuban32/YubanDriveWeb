import aixos from "axios";
const config:Object = {
    baseURL:"http://localhost:5000",
    // withCredentials:true,
    timeout: 60 * 1000
}

const _axios:any = aixos.create(config);

_axios.interceptors.request.use(
    function (request:any){
        let user = localStorage.getItem("Authorization");
        if(user){
            request.headers["Authorization"] = user;
        }
        //前置拦截器
        
        return request;
    },
    function (error:any){

        return Promise.reject(error);
    }
)
_axios.interceptors.response.use(
    function (response:any){
        //后置拦截器
        if(response.config.url != "/user"){
            if (response.data.code == 200) {
                ElMessage({
                    showClose: true,
                    message: response.data.msg,
                    type: 'success',
                })
            } else if (response.data.code == 500){
                ElMessage({
                    showClose: true,
                    message:response.data.msg,
                    type: 'error',
                })
            }
        }
        return response;
    },
    function (error:any){
        return Promise.reject(error);
    }
)

export default _axios;