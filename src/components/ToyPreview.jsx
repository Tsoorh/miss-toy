import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal } from "./Modal";
import {acRemoveToy} from "../store/actions/toys.action"
import { showSuccessMsg } from "../service/event-bus.service";

export function ToyPreview({toy}){
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [toyIdToDelete,setToyIdToDelete] = useState();
    
    const navigate = useNavigate();

    function onHandleClick({target}){       
        const {id}= target;
        switch (target.value) {
            case "details":
                navigate(`/toys/${target.id}`)
                return
            case "edit":
                navigate(`/toy-edit/${target.id}`)
                return
            case "delete":
                onOpenModal();
                setToyIdToDelete(id);
            default:
                break;
        }
    }
    function onOpenModal(){
        setIsModalOpen(true);
    }
    function onCloseModal(){
        setIsModalOpen(false);
    }
    async function onHandleDelete(){
        try{
            acRemoveToy(toyIdToDelete);
            showSuccessMsg(`Successfully removed id : ${toyIdToDelete}`)
        }catch(err){
            console.log("🚀 ~ onHandleDelete ~ err:", err)
            showErrorMsg(`Error removing toy, id : ${toyIdToDelete}`)
        }
    }
    
    const {_id,txt,inStock,createAt,price,labels}=toy;    
    return (
        <article className="toy-preview flex space-between">
            <h1>{txt}</h1>
            <p> price - {price}$</p>
            <p>{inStock ? 'In-stock' : 'Sold-out'}</p>

            <div className="preview-btn flex">
                <button onClick={onHandleClick} value="details" id={_id}>Details</button>
                <button onClick={onHandleClick} value="edit" id={_id}>Edit</button>
                <button onClick={onHandleClick} value="delete" id={_id}>Delete</button>
            </div>
           {isModalOpen&&<Modal onCloseModal={onCloseModal}>
                <h1>Are you sure?</h1>
                <div className="btn-div">
                    <button onClick={onHandleDelete}>Yes</button>
                    <button onClick={onCloseModal}>No</button>
                </div>
            </Modal>}
        </article>
    )

}