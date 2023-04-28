//时间格式化
export const dateTimeFormat = (time:string) =>{
    let date = time ? new Date(time) : new Date()
    let year:string|number = date.getFullYear();
    let month:string|number = date.getMonth()+1;
    let day:string|number = date.getDate();
    let hours:string|number = date.getHours();
    let min:string|number = date.getMinutes();
    if(month < 10) month = '0' + month;
    if(day < 10) day = '0' + day;
    if(hours < 10) hours = '0' + hours;
    if(min < 10) month = '0' + min;
    return (`${year}/${month}/${day} ${hours}:${min}`)
}

