import aixos from "axios";
import router from "../router";
const config:Object = {
    baseURL:"http://localhost:5000",
    // withCredentials:true,
    timeout: 60 * 1000
}

const _axios:any = aixos.create(config);

_axios.interceptors.request.use(
    function (request:any){
        let user = localStorage.getItem("Authorization");
        //判断JWT是否为空
        if(user){
            //非登录接口 都要带上JWT TOKEN
            if(request.url!="/user/login"){
                request.headers["Authorization"] = user;
            }
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
        const CODE = response.data.code!
        if(response.config.url != "/user"){
            if (CODE == 200) {
                ElMessage({
                    showClose: true,
                    message: response.data.msg,
                    type: 'success',
                })
            } else if (CODE == 500){
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
        //捕捉错误
        const ERROR_CODE = error.response.status;
        if ( ERROR_CODE== 401){
            ElMessage({
                showClose:true,
                message:error.response.data.msg,
                type:'error'
            })
            router.push('/NotAuthorization')
        }else if(ERROR_CODE == 400){
            ElMessage({
                showClose:true,
                message:"请求的资源不存在",
                type:'error'
            })
            router.push('/:catchAll(.*)')
        }
        return Promise.reject(error);
    }
)

export default _axios;