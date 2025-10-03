import {toyService} from "../../service/toy.service"
import { REMOVE_TOY, SET_CATEGORIES, SET_IS_LOADING, SET_MAX_IN_FILTER, SET_RANGE,ADD_TOY, SET_TOYS,UPDATE_TOY } from "../reducers/toys.reducers"
import {store} from "../store"


export async function acLoadToys(filterBy){
    try{
        store.dispatch({type: SET_IS_LOADING,isLoading:true})
        const toys = await toyService.query(filterBy)
        store.dispatch({type:SET_TOYS,toys})
        store.dispatch({type: SET_IS_LOADING,isLoading:false})
    }
    catch (err) {
        console.log("🚀 ~ acLoadToys ~ err:", err)
        throw err
    }
}

export async function acRangAndCategoris() {
    try{
        const allToys = await toyService.query(toyService.getDefaultFilter());
        const range = toyService.getRange(allToys)
        const categories = toyService.getCategories(allToys)
        store.dispatch({type:SET_RANGE,range})
        store.dispatch({type:SET_CATEGORIES,categories})
        store.dispatch({type:SET_MAX_IN_FILTER,max:range.max})
    }
    catch (err) {
        console.log("🚀 ~ acLoadToys ~ err:", err)
        throw err
    }
    
}

export async function acUpdateToy(toy){
    try{
        const toyToUpdate = await toyService.save(toy);
        store.dispatch({type:UPDATE_TOY,toy:toyToUpdate})
        await acRangAndCategoris();
    }catch(err){
        console.log("🚀 ~ acSaveNewToy ~ err:", err)
        throw err           
    }
}
export async function acSaveNewToy(toy){
    try{
        const newToy = await toyService.save(toy);
        store.dispatch({type:ADD_TOY,toy:newToy})
        await acRangAndCategoris();
    }catch(err){
        console.log("🚀 ~ acSaveNewToy ~ err:", err)
        throw err           
    }
}

export async function acRemoveToy(toyId){
    try{
        console.log("🚀 ~ acRemoveToy ~ toyId:", toyId)
        
        await toyService.remove(toyId)
        store.dispatch({type:REMOVE_TOY,toyId})
        await acRangAndCategoris();
    }catch(err){
        console.log("🚀 ~ acRemoveToy ~ err:", err)
        throw err
    }
}