import { useState, useEffect,useRef } from "react";
import { utilService } from "../service/util.service";

export function ToyFilter({ filterBy, onSetFilter, categories, range }) {  
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy });
  const debounceSetFilter = useRef(utilService.debounce(onSetFilter,300)).current;
  
  useEffect(() => {
    debounceSetFilter(filterByToEdit);
  }, [filterByToEdit]);


  function onChangeFilter(ev) {
    ev.preventDefault();
    const { name, value } = ev.target;
    setFilterByToEdit((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  }


  const { txt, price, category, inStock } = filterByToEdit;  
  const { min, max } = range;
  return (
    <form className="filter-form">
      <h1>Filter</h1>
      <div className="filter-inputs">
        <div>
          <label htmlFor="txt">Name </label>
          <input
            type="text"
            id="txt"
            name="txt"
            onChange={onChangeFilter}
            value={txt}
          />
        </div>

        <div className="price-div">
          <label htmlFor="price">{`${price || max} $`}</label>
          <input
            type="range"
            id="price"
            name="price"
            min={min}
            max={max}
            onChange={onChangeFilter}
            value={price || max}
          />

        </div>

        <div>
          <label htmlFor="category">Category </label>
          <select
            name="category"
            id="category"
            onChange={onChangeFilter}
            value={category}
          >
            {categories &&
              categories.length > 0 &&
              categories.map((categ, idx) => {
                return (
                  <option value={categ} key={categ + idx}>
                    {categ}
                  </option>
                );
              })}
          </select>
        </div>
        <div>
          <label htmlFor="status">Status </label>
          <select
            name="inStock"
            id="status"
            onChange={onChangeFilter}
            value={inStock}
          >
            <option name="inStock" value=''>All</option>
            <option name="inStock" value='inStock'>In stock</option>
            <option name="inStock" value='soldOut'>Sold out</option>
          </select>
        </div>
        <div className="sort">
          <label htmlFor="sort">Sort by </label>
          <select name="sort" id="sort" onChange={onChangeFilter}>
            <option name="sort" value=""></option>
            <option name="sort" value="txt">Name</option>
            <option name="sort" value="price">Price</option>
            <option name="sort" value="createAt">Creation Time</option>
          </select>
        </div>
      </div>
    </form>
  );
}
