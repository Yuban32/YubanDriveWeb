import { App, createApp } from "vue"
import FileMenuComponent from "./FileMenuCopy.vue"
const FileMenu:any = (options:any) =>{
    const FileMenuApp = createApp(FileMenuComponent,options)
    showFileMenu(FileMenuApp)
}

function showFileMenu(app:App){
    const el = document.createDocumentFragment();
    let vm = app.mount(el);
    document.body.appendChild(el);
    document.onclick = closeFileMenu(app)
}

const closeFileMenu:any = (app:App)=>{
    document.onclick = null;
    app.unmount();
}
export default FileMenu;
