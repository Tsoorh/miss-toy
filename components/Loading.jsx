import { utilService } from "../service/util.service"
import { useEffect, useRef } from "react"
import 'animate.css'


export function Loading(){
    const loadingEl = useRef()


    useEffect(()=>{
        if (loadingEl.current) {
            loadingEl.current.classList.add("animate__slower")
            utilService.animateCSS(loadingEl.current,'flash')
            const timeoutId = setTimeout(()=>{
                loadingEl.current.classList.remove("animate__slow")
            },3000)
            return clearTimeout(timeoutId);
        }
    },[])

    return(
        <section className="loading">
            <h2 ref={loadingEl}>Loading...</h2>
        </section>
    )
}