import BrandItem from './brand-item'
function BrandList(props)
{
    return(
            <ul>
                {props.brand.map((ele)=>{
                    return <BrandItem 
                    changeStatus ={props.changeStatus}
                    key ={ele.id}
                    name ={ele.name}
                    status = {ele.status}
                    />
                })}
            </ul>
    )

}
export default BrandList
