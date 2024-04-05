//import {useState, useEffect} from 'react'
//import axios from 'axios'
//import BrandContainer from "./components/brand-container"
//import CategoryContainer from './components/category-container'

/*function App()
{
    
    const [brand,setBrand] = useState([])
    const [category,setCategory] = useState([])

    //useEffect - Brand
    useEffect(()=>{
        axios.get("http://localhost:3055/api/brands")
        .then((response)=>{
            const result = response.data
            console.log(result)
            setBrand(result)
        })
        .catch((err)=>{
            console.log(err)
            alert(err.message)
        })
    },[])

    //useEffect category
    useEffect(()=>{
        axios.get("http://localhost:3055/api/category")
            .then((response)=>{
                const result = response.data
                console.log(result)
                setCategory(result)
            })
            .catch((err)=>{
                console.log(err)
            })
    },[])

    const addBrand =(brands)=>{
        //console.log('app brand',brands)
        setBrand([...brand,brands])
    }

    const changeStatus =(id)=>{
        console.log("app component")
    } 


    
    return(
        <div>
            <h1>E-Commerce App</h1>
            {<BrandContainer 
            brand ={brand}
            addBrand ={addBrand}
            />}

            <CategoryContainer  category = {category}
            changeStatus ={changeStatus}
            />
        </div>
    )
}
export default App*/
import {useState, useReducer, useMemo} from 'react'

function reducer(state,action)
{
    switch (action.type)
    {
        case "ADD" :{
            const itemInCart = state.find((ele)=>
                ele.id === action.payload.id)
                if(itemInCart)
                {
                    itemInCart.quantity += 1
                    return [...state]
                }
                else{
                    return [...state,{...action.payload,quantity : 1}]
                }
        }
        case "REMOVE" :{
            return state.filter((ele)=> ele.id !== action.payload)
        }

        case "DEC" :{
            return state.map((ele)=>{
                if(ele.id === action.payload)
                {
                    return {...ele, quantity : ele.quantity - 1};
                }
                else{
                    return ele
                }
            })
        }
        case "INC" :{
            return state.map((ele)=>{
                if(ele.id === action.payload)
                {
                    return {...ele, quantity : ele.quantity +1}
                }
            })
        }
    }
}       
function App()
{
    const [search,setSearch] = useState("")
    const [cart,dispatch] = useReducer(reducer,[])
    const products =[
        {id :1, name : "Laptop", price : 1500},
        {id :2, name : "charger", price : 500},
        {id :3, name : "cycle", price : 1000}
    ]

    const calculateTotal =useMemo(()=>{
        /*In this example, the reducer function calculates the sum of all numbers in the array. 
        The initial value of the accumulator is 0, and for each element in the array, 
        it adds the current value to the accumulator. Finally, it returns the accumulated sum.*/

        console.log("calculate total function")
        const result = cart.reduce((acc,cv)=>{
            return acc+cv.price * cv.quantity
        },0)
        return result
    },[cart])

    return(
        <div>
            <h2>POS App</h2>
            <input type = "text"
                placeholder='search item'
                value = {search}
                onChange={(e)=>setSearch(e.target.value)}
            />
            {search && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.filter((ele)=>
                            {
                            return ele.name.toLowerCase().includes(search.toLowerCase())
                            } 
                        ).map((ele)=>{
                            return(
                                <tr key = {ele.id}>
                                    <td>{ele.name}</td>
                                    <td>{ele.price}</td>
                                    <td>
                                        <button onClick ={()=>{
                                            dispatch({type:"ADD", payload:ele});
                                        }}>Add</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}

            <h2>Cart</h2>
            {cart.length >0 &&(
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((ele)=>{
                                return(
                                    <tr key = {ele.id}>
                                        <td>{ele.name}</td>
                                        <td>{ele.price}</td>
                                        <td><button disabled={ele.quantity == 1}
                                            onClick={()=>{dispatch({type : "DEC", payload : ele.id})}}
                                        >-1</button>{ele.quantity }<button onClick={()=>{
                                            dispatch({type : "INC",payload:ele.id})}}>+1</button></td>
                                        <td>{ele.price * ele.quantity}</td>
                                        <td>
                                            <button onClick ={()=>{
                                                dispatch({type :"REMOVE", payload: ele.id })
                                            }} >Remove</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <h3>Cart Total - {calculateTotal}</h3>
                </div>
            )}
        </div>
    )
}
export default App