import productItem from './product-item'
export default function ProductTable(props)
{
    return(
        <table>
            <thead>
                <tr>
                    <th>ProductName</th>
                    <th>ProductImage</th>
                    <th>MRP</th>
                    <th>Tax</th>
                    <th>B2BPrice</th>
                    <th>Barcode</th>
                    <th>Status</th>
                    <th>Catgeory</th>
                    <th>Brand</th>
                 </tr>
            </thead>
            <tbody>
                {props.products.map((ele)=>{
                    return(
                        <productItem 
                            key ={ele._id}
                            products = {ele}
                            categories = {props.categories}
                            brands ={props.brands}
                        />
                    )
                })}
            </tbody>
        </table>
    )
} 