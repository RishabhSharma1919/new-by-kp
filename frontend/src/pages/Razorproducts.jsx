import React from 'react'

const Razorproducts = () => {
    
const checkoutHandeler=async(amount)=>{
    console.log(amount);
    const {data:keyData}=await axios.get("api/payment/getkey");
    const {key}= keyData
    console.log(key);
    const {data:orderData}= await axios.post("/api/payment/process",{amount})
console.log(orderData);
    const{order}=orderData;
    console.log(order);
}


  return (
    <div className='products-container'>
 <div className='product-card'>
    <img src="" alt="product" className='product-image'/>
    <h3 className='product titlew'>product title</h3>
<p className='product-price'>price<strong>200</strong></p>
<button className='pay-button' onClick={()=>checkoutHandeler(200)}>pay (200)</button>
    </div>      
    </div>
  )
}

export default Razorproducts
//<script src= "http://checkout.razorpay.com/v1/checkout.js"><script/> 1:5  //html below order