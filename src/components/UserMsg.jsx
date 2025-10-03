import { eventBusService } from "../service/event-bus.service";

import { useState,useEffect } from "react";

export function UserMsg(){
    const [msg,setMsg] = useState(null)

    useEffect(()=>{        
        const unsubscribe = eventBusService.on('show-user-msg', msg =>{
            setMsg(msg)
            setTimeout(()=>{
                setMsg(null)
            },3000)
        })
        return ()=>(unsubscribe());
    },[])

    function onCloseMsg() {
        setMsg(null);
    }

    if(!msg) return null
    return(
        <div className={`user-msg flex ${msg.type}`}>
            <h4>{msg.txt}</h4>
            <button onClick={onCloseMsg} className="close-btn">x</button>
        </div>
    )
}
