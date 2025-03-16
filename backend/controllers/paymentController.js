import { instance } from "../server.js";


export const processPayment=async(req,res)=>{
   const options ={
    amount:Number(req.body.amount*100),
    currency:"INR"
   }
   const order = await instance.orders.create(options)
    res.status(200).json({
      success:true,
      order
    })
  }
  export const getKey=async(req,res)=>{
    res.status(200).json({
        key:process.env.RAZORPAY_API_KEY,
    })
  }

  export const paymentVerification=async(req,res)=>{
const {razorpay_payment_id,razor_order_id,razor_signature}=req.body;
const body = razor_order_id + "|" +razorpay_payment_id
const expectedSignature= crypto.createHmac("sha256",process.env.RAZORPAY_API_SECRET).update(body.toString()).digest("hex")

console.log(`Razorpay Signature,${razor_signature}`);
console.log(`expected Signature,${expectedSignature_signature}`);

const isAuthentic=expectedSignature===razor_signature;
if(isAuthentic){
    return res.redirect(`http://localhost:5173/paymentSuccess?
        reference=${razorpay_payment_id}`
    )
}
else{
    res.status(400).json({
        success:false
    })
}

    res.status(200).json({
        success:true
    })
  }

  //i thing miss