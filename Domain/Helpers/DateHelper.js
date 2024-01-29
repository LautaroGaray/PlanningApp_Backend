export default function DateTimeNow(){
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Los meses en JavaScript son indexados desde 0
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return `${day}-${month}-${year}-${hours}:${minute}:${seconds}`;
}