/*import axios from 'axios'
import {useEffect, useState} from 'react'
function Products()
{
    const [products,setProducts] = useState([])
    const [name,setName] = useState('')
    const [mrp,setMrp] = useState('')
    const [tax,setTax] = useState('')
    const [barcode,setBarcode] = useState('')
    const handleSubmit =(e)=>{
        e.preventDefault()
        const formData ={
            name : name,
            mrp : mrp,
            tax : tax,
            barcode : barcode
        }
        console.log(formData)
    }

    useEffect(()=>{
        //console.log("useeffect")
        axios.get("http://localhost:3055/api/products")
            .then((response)=>{
                const result = response.data
                setProducts(response.data)
            })
            .catch((err)=>{
                alert(err.message)
            })
    },[])

    return(
        <div>
            {console.log('categories jsx')}
            {Products.length ==0 ? <p>No Products found . Add your first Product</p> :{

            }}
            {/*<h2>Add Products</h2>
            <form onSubmit={handleSubmit}>
                <label>Enter product name</label>
                <input
                type ="text"
                value = {name}
                onChange ={(e)=>{setName(e.target.value)}}
                /><br />
                <label>Enter MRP</label>
                <input 
                type ="text"
                value ={mrp}
                onChange={(e)=>{setMrp(e.target.value)}}
                /><br />
                <label>Enter Tax</label>
                <input 
                type = "text"
                value={tax}
                onChange={(e)=>{setTax(e.target.value)}}
                />
                <br />
                <label>Barcode</label>
                <input 
                type ="text"
                value ={barcode}
                onChange={(e)=>{setBarcode(e.target.value)}}
                />
                <br />
                <button>submit</button>
    </form>}

        </div>
    )
}
export default Products*/
