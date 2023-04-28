import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { State } from './vuex.d';

export const key: InjectionKey<Store<State>> = Symbol();
export const store = createStore<State>({
    state:{
        jwtToken:"",
        userData:{}
    },
    mutations:{
        setJwtToken(state:State,JwtToken:string){
            //持久化 将数据保存到本地浏览器
            localStorage.setItem("Authorization",JwtToken);
            state.jwtToken = JwtToken;
        },
        setUserData(state:State,userData:object){
            state.userData = userData;
            localStorage.setItem("userData",JSON.stringify(userData));
        }
    },


})