import {toyService} from "../../service/toy.service"

//TOYS:
export const SET_TOYS="SET_TOYS"
export const ADD_TOY="ADD_TOY"
export const REMOVE_TOY="REMOVE_TOY"
export const UPDATE_TOY="UPDATE_TOY"

//ISLOADING:

export const SET_IS_LOADING = "SET_IS_LOADING";

//FILTER BY:
export const SET_FILTER_BY = "SET_FILTER_BY";
export const SET_MAX_IN_FILTER="SET_MAX_IN_FILTER";

//RANGE:
export const SET_RANGE="SET_RANGE";

//CATEGORIES:
export const SET_CATEGORIES="SET_CATEGORIES";

const initialState = {
  toys: [],
  isLoading: true,
  filterBy: toyService.getDefaultFilter(),
  range:{min:0,max:5000},
  categories:["All"]
};

export function toyReducer(state = initialState, cmd) {
    switch (cmd.type) {      
    //TOYS:
    case SET_TOYS:
      return {
        ...state,
        toys: cmd.toys,
      };
    case ADD_TOY:
      return {
        ...state,
        toys: [...state.toys, cmd.toy],
      };
    case REMOVE_TOY:
      return {
        ...state,
        toys: state.toys.filter((toy) => toy._id !== cmd.toyId),
      };
    case UPDATE_TOY:
      return {
        ...state,
        toys: state.toys.map((toy) => (toy._id === cmd.toy._id ? cmd.toy : toy)),
      };


      //FILTER BY:
      case SET_FILTER_BY:
        return{
            ...state,
            filterBy: cmd.filterBy
        }
      case SET_MAX_IN_FILTER:
        return{
          ...state,
          filterBy:{...state.filterBy, price:cmd.max}
        }
        //RANGE:
        case SET_RANGE:
          return{
            ...state,
            range: cmd.range
          }

          //CATEGORIES
          case SET_CATEGORIES:
            return{
              ...state,
              categories: cmd.categories
            }

          //IS_LOADING
          case SET_IS_LOADING:
            return{
              ...state,
              isLoading:cmd.isLoading
            }

    default:
      return state;
  }
}
