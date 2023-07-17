export const  getDate =  new Date().toLocaleString('default', {month: 'short', year: 'numeric', day: '2-digit'})
export  const getCurrentYear = () : number => {
    let today = new Date();
    return  today.getFullYear();
}
export const reCreateDate = (date : Date | string) : string => {
    return  new Date(date).toLocaleString('default', {month: 'short', year: 'numeric', day: '2-digit'})
}
const getFirstLetter = (word : Date)  : string =>  {
    const letter  : string [] = String(word).split('');
    return  letter[0] + letter[1] + letter[2]
}
export const getLastweek = (number : number) => {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - number);
    let lastWeekMonth = lastWeek.getMonth() + 1;
    let lastWeekDay = lastWeek.getDate();
    let lastWeekYear = lastWeek.getFullYear();
    let lastWeekDisplay = lastWeekMonth + "/" + lastWeekDay + "/" + lastWeekYear;
   const newData  =  new Date (lastWeekDisplay);
    return  getFirstLetter(newData)

}

export const getCurrentDate = (number : number) => {
    let today = new Date();
    let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - number).toLocaleTimeString([], {month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'});
    return lastWeek;
}
export default getDate;