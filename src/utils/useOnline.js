import {useState,useEffect} from "react";
const useOnline = ()=>{
    const [isOnline, setisOnline] = useState(true);
    
    useEffect(()=>{
 
        const handleOnline=()=>{
            setisOnline(true);
        };

        const handleoffline=()=>{
            setisOnline(false);
        };

         window.addEventListener("online",handleOnline);
         window.addEventListener("offline",handleoffline );

         return ()=>{
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleoffline);
         };

    },[]);
    
    
    return isOnline ;
};
export default useOnline ;
