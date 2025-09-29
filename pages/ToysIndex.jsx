import { useEffect } from "react";
import {ToyList} from "../components/ToyList";
import {ToyFilter} from "../components/ToyFilter";
import { useSelector,useDispatch } from "react-redux";
import { SET_FILTER_BY } from "../store/reducers/toys.reducers";
import { acLoadToys, acRangAndCategoris } from "../store/actions/toys.action";
import { useSearchParams } from "react-router-dom";
import { utilService } from "../service/util.service";
import { useNavigate } from "react-router-dom";


export function ToyIndex(){
    const toys = useSelector(storeState => storeState.toyModule.toys)
    const filterBy = useSelector(storeState => storeState.toyModule.filterBy)
    const categories = useSelector(storeState => storeState.toyModule.categories)
    const range = useSelector(storeState => storeState.toyModule.range)
    
    
    
    const [searchParams,setSearchParams]=useSearchParams()

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(()=>{
        acLoadToys(filterBy)
    },[searchParams])

    useEffect(()=>{
        setSearchParams(utilService.getTruthyValues(filterBy));
    },[filterBy])

    useEffect(()=>{
        acRangAndCategoris()
    },[])

    function onSetFilter(filterToSet){
        dispatch({type:SET_FILTER_BY,filterBy:filterToSet});
    }

    function onHandleToyEdit() {
        navigate("/toy-edit")
    }

    return(
        <>
        <section className="filter-sec sec">
            <ToyFilter filterBy={filterBy} onSetFilter={onSetFilter} categories={categories} range={range}/>
        </section>
            <section className="add-new-sec sec">
                <button onClick={onHandleToyEdit}>Add new toy</button>
            </section>
            <ToyList toys={toys}/>
        </>
    )
}