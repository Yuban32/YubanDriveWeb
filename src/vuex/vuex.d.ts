import { Store } from 'vuex'
  // 声明自己的 store state
  export interface State {
    jwtToken: string,
    userData:object,
  }

  // 为 `this.$store` 提供类型声明
  export interface ComponentCustomProperties {
    $store: Store<State>
  }
