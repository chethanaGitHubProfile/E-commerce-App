import {useState} from 'react'
import axios from 'axios'
export default function BrandForm(props)
{
    const [name,setName] = useState('')

    const handleSubmit =(e)=>{
        e.preventDefault()

        const formData ={
            name : name,
        }
         //console.log(formData)
        axios.post("http://localhost:3055/api/brands",formData)
            .then((response)=>{
               // console.log(response)
               const result = response.data
               props.addBrand(result)
            })
            .catch((err)=>{
                alert(err.message)
            })
    }
    return(
        <div>
            <h2>Add Brand</h2>
            <form onSubmit = {handleSubmit}>
                <label htmlFor="name">Enter Name</label>
                <input
                    type = "text"
                    value = {name}
                    onChange = {(e)=>setName(e.target.value)}
                />
                <input type = "submit"/>
            </form>
        </div>
    )
}