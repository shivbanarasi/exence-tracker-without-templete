const express=require('express');
const Razorpay = require('razorpay');
const route=express.Router();

route.post('/payment',(req,res)=>{
var instance=new Razorpay({key_id:"rzp_test_DTp0dOzJ3YQj2L",key_secret:"BXey91M5T3t1WccQs643Bpvf"})
var options={
    amount:1000,
    currency:"INR",
    receipt:"rcpt"
}
instance.orders.create(options, function(err, order) {
    console.log(order);
    res.send({orderId:order.id})
  });
});

route.post("/api/payment/verify",(req,res)=>{

    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', 'BXey91M5T3t1WccQs643Bpvf')
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.response.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.response.razorpay_signature)
      response={"signatureIsValid":"true"}
         res.send(response);
     });
   
  

module.exports=route;