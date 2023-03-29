const express=require('express');
const Razorpay = require('razorpay');
const crypto = require("crypto");
const db=require('../mysql/connn')
const route=express.Router();

route.get('/login/:email/payment',(req,res)=>{
   const email= req.params.email
    res.render('premium',{
        title:'buy premium membership',
        email:email
    
    })
})


route.post("/payment",async(req,res)=>{

    const amount=2500;
var instance=new Razorpay({key_id:"rzp_test_DTp0dOzJ3YQj2L",key_secret:"BXey91M5T3t1WccQs643Bpvf"})
var options={
    amount:amount,
    currency:"INR",
    receipt:"rcpt"
}
instance.orders.create(options, function(err, order) {
    console.log(order);
   console.log(order.id);
   res.status(201).json({
    success:true,
    amount,
    order

  })
  });
 
  
});

route.post("/:email/payment/verify",(req,res)=>{
    const email=req.params.email;
    console.log(email);
    const{razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body

    let body=razorpay_order_id + "|" + razorpay_payment_id;
   console.log(body)
     
     var expectedSignature = crypto
     .createHmac('sha256', 'BXey91M5T3t1WccQs643Bpvf')
     .update(body.toString())
     .digest('hex');
     
     const verifyPayment=expectedSignature===razorpay_signature;
     if(verifyPayment){
        // db.query(`insert into paymentdetail (order,payment,sign) 
        // values('${razorpay_order_id}','${razorpay_payment_id}','${razorpay_signature}')`,(err,result)=>{
        //     if(err){
        //         console.log(err)
        //     }       
        // } )
        db.query(`update user 
set payment='success' 
where email="${email}"`,(err,result)=>{
if(err){
console.log(err)
}    
else{
    res.redirect(`/login/${email}/lead`)
}   
})
     }
    
        // res.status(200).json({
        //     success:true
        // });
     });
      
     
   
  

module.exports=route;