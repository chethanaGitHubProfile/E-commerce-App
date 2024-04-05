import { prependOnceListener } from "../../../products/app/models/brand-model";

export default function ProductItem(props)
{
    return(
        <div>
            <h2>Listing products - </h2>
            <tr>
                <td>{props.products.name}</td>
                <td>{props.products.image}</td>
                <td>{proops.products.mrp}</td>
                <td>{props.products.tax}</td>
                <td>{props.products.B2BPrice}</td>
                <td>{props.products.barcode}</td>
                <td>{props.products.status}</td>
                <td>{props.products.categoryId}</td>
                <td>{props.products.brandId}</td>
            </tr>
            <button onClick ={handleClick}>Remove</button>
        </div>
    )
}