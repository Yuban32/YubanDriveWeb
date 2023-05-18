/// <reference types="vite/client" />
declare module "*.vue"{
    import { DefineComponent } from 'vue';

    const component: DefineComponent<{},{},any>;
    export default component;
}
interface ImportMetaEnv{
    VITE_APP_TITLE:string;
    VITE_APP_PORT:string;
    VITE_APP_BASE_API:string;
}
interface ImportMeta{
    readonly env: ImportMetaEnv;
}
declare module "spark-md5"
declare module 'vue3-video-play' {
    import { ComponentOptions } from 'vue'
    const content: ComponentOptions
    export default content
  }