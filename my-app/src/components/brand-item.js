import axios from 'axios'
import  {useState} from 'react'

export default function BrandItem(props)
{
    const [active,setActive] = useState(true)
    
    const handleStatusToggle =()=>{
        setActive(!active)
         axios.put(`http://localhost:3055/api/brands/${props.id}`)
            .then((response)=>{
                console.log(response.data)
                const result = response.data
                props.changeStatus(result._id)
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    return(
        <div>
            <li>{props.name} 
            <button onClick = {handleStatusToggle}>status</button>

            </li>
        </div>
    )
}

