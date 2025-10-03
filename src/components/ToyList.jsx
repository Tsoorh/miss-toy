// import { useSelector } from "react-redux";
import { Loading } from "./Loading";
import { ToyPreview } from "./ToyPreview";

export function ToyList({toys}){
    // const isLoading = useSelector(storeState=>storeState.toyModule.isLoading)


    // if(!toys || isLoading) return <Loading/>
    if(!toys) return <Loading/>
    return(
     <section className="toys-list-sec sec flex">
        <h1>Toys</h1>
        <div className="toys-layout">
        {toys.map((toy,idx)=>{
            return <ToyPreview toy={toy} key={toy+idx}/>
        })}
        </div>
     </section>   
    )
}