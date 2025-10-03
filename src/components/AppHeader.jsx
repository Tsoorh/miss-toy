import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function AppHeader(){
    const navigate=useNavigate();

    return (
        <div className="app-header flex space-between align-items">
            <div className="header-logo flex" onClick={()=>{navigate("/")}}>
                <img width="48" height="48" src="https://img.icons8.com/emoji/48/teddy-bear-.png" alt="teddy-bear-"/>
                <h1>Miss toy</h1>
            </div>



            <div className="navigation-bar">
                <NavLink to={"/"} ><span className="nav">Home</span></NavLink>  
                <NavLink to={"/toys"} ><span className="nav">Toys</span></NavLink>
                
            </div>

        </div>
    )
}