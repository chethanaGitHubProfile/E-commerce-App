import BrandList from './brand-list'
import BrandForm from './brand-form'
function BrandContainer(props)
{

    return(
        <div>
            <h2>Listing Brands-{props.brand.length}</h2>
            <BrandList 
             brand ={props.brand}
            changeStatus = {props.changeStatus}
            />
            <BrandForm 
            addBrand = {props.addBrand}/>
        </div>
    )
}
export default BrandContainer