import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toyService } from "../service/toy.service";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SET_IS_LOADING } from "../store/reducers/toys.reducers";
import { Loading } from "./Loading";

export function ToyDetails(){

    const {toyId} =useParams()
    const isLoading = useSelector(storeState=>storeState.toyModule.isLoading)

    const [toy,setToy] = useState();
    
    const navigate= useNavigate();
    const dispatch=useDispatch();
    
    useEffect(()=>{
        getCurrentToy(toyId);
    },[toyId])
    
    async function getCurrentToy(_id){
        try{
            dispatch({type:SET_IS_LOADING,isLoading: true})
            const toyFromService = await toyService.get(_id)
            setToy(toyFromService);
            dispatch({type:SET_IS_LOADING,isLoading : false})
        }catch (err){
            console.log("🚀 ~ getCurrentToy ~ err:", err)
        } 
    }

    function getTime(time){
        const formattedTime = new Date(time);
        return formattedTime.toString();
    }

    function handleNextPrev(navToyId){
        navigate(`/toy/${navToyId}`)
    }

    if (isLoading || !toy) return <Loading/>
    const {txt,price,labels,createdAt,inStock,nextToyId,prevToyId} = toy;
    return(
        <section className="toy-details flex sec">
            <div className="btn-details flex">
                <button onClick={()=>navigate(`/toys/${prevToyId}`)}>Prev</button>
                <button onClick={()=>navigate(`/toys/${nextToyId}`)}>Next</button>
            </div>
            <h1>{txt}</h1>
            <h2>Categories - {labels.map((label,idx)=> {return <span key={label+idx}>{label}, </span>})}</h2>
            <p>Price {price} $</p>
            <p>Created at {getTime(createdAt)}</p>
            {(inStock)? 'In stock':'Sold out'}
            <button onClick={()=>navigate("/toys")}>back</button>
        </section>
    )
}