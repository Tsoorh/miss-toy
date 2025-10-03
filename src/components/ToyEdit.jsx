import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toyService } from "../service/toy.service";
import { Loading } from "./Loading";
import { useSelector, useDispatch } from "react-redux";
import { SET_IS_LOADING } from "../store/reducers/toys.reducers";
import { acSaveNewToy, acUpdateToy } from "../store/actions/toys.action";
import {showSuccessMsg,showErrorMsg} from "../service/event-bus.service";

export function ToyEdit() {
  const { toyId } = useParams();
  const [toy, setToy] = useState({ txt: "", price: 0 });
  const isLoading = useSelector((storeState) => storeState.toyModule.isLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (toyId) getCurrentToy(toyId);
    if (!toyId) dispatch({ type: SET_IS_LOADING, isLoading: false });
  }, [toyId]);

  async function getCurrentToy(_id) {
    try {
      dispatch({ type: SET_IS_LOADING, isLoading: true });
      const toyFromService = await toyService.get(_id);
      setToy({ ...toyFromService });
      dispatch({ type: SET_IS_LOADING, isLoading: false });
    } catch (err) {
      console.log("🚀 ~ getCurrentToy ~ err:", err);
    }
  }

  function onHandleChange(ev) {
    ev.preventDefault();
    let { name, value, type } = ev.target;
    switch (type) {
      case "number":
        value = +value;
    }
    setToy((prevToy) => ({
      ...prevToy,
      [name]: value,
    }));
  }

  async function onSave(ev) {
    try {
      ev.preventDefault();
      if (toyId) {
        const toyToSave = { ...toy, _id: toyId };
        await acUpdateToy(toyToSave);
      } else {
        await acSaveNewToy(toy);
      }
      showSuccessMsg(`Toy "${toy.txt}" added successfully! `)
      navigate("/toys");
    } catch (err) {
      console.log("🚀 ~ onSave ~ err:", err);
      showErrorMsg(`Couldn't add toy named: "${toy.txt}" `)
      throw err;
    }
  }

  function onBack(ev) {
    ev.preventDefault();
    navigate("/toys");
  }

  if (isLoading) return <Loading />;
  const { txt, price } = toy;
  const isToyId = toyId ? "Edit" : "Add";
  return (
    <form className="edit-form flex sec">
      <h1>{isToyId} Toy</h1>
      <div>
        <label htmlFor="text">Name </label>
        <input
          type="text"
          name="txt"
          id="text"
          value={txt}
          onChange={onHandleChange}
        />
      </div>
      <div>
        <label htmlFor="price">Price </label>
        <input
          type="number"
          name="price"
          id="price"
          value={price}
          onChange={onHandleChange}
        />
      </div>
      <div>
        <button onClick={onBack}>Back</button>
        <button onClick={onSave}>Save</button>
      </div>
    </form>
  );
}
