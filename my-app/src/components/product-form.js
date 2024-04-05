import {useState} from 'react'
export default ProductForm(props)
{
    const [names,setNames] = useState('')
    const [image,setImage] = useState('')
    const [mrp,setMrp] = useState('')
    const [tax,setTax] = useState('')
    const [B2BPrice,setB2BPrice] = useState('')
    const [barcode,setBarcode] = useState('')
    const [status,setStatus] = useState('')

    return(
        <div>
            <h2>Add Products</h2>
            <form>
                <label htmlFor = "name">Enter product name</label>
                <input 
                type ="text"
                value ={names}
                />

                <label>Enter MRP</label>
            </form>
        </div>
    )
}