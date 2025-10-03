import {useEffect, useState} from "react";

export function useOnChange(currState,name,value,dispatchType){
    const [state,setState] = useState(...currState);

    setState(prev=>({
        ...prev,
        [name]:value
    }))
     
    dispatch({type:dispatchType,state})
    return state;
}