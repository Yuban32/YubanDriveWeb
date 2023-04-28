import { Ref } from "vue";

export interface UserData{
    id:number | any,
    username:string | null,
    email:string | null,
    avatar:string | any,
    usedStorage:number | any,
    totalStorage:number | any,
}

export class IUserData implements UserData{
    id:number = 0;
    username:string = '';
    email:string = '';
    avatar:string = '';
    usedStorage:number = 0;
    totalStorage: number = 0;

}

export interface FileListDTO{
    type:String,
    category:String,
    name:String,
    fileUUID:String,
    parentFileUUID:String,
    size:String,
    uploader:String,
    createdTime:String,
    relativePath:String,
    imageURL?:String,
    thumbnailURL?:String
}

export interface FileUploadType{
    name:string
    size:number
    parsePercentage:Ref<number>
    uploadPercentage:Ref<number>
    uploadSpeed:string,
    chunkList:any
    file:any
    uploadingStop:boolean
}