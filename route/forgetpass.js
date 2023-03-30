const express=require('express');
const bcrypt=require('bcrypt');
const route=express.Router();
const db=require('../mysql/connn')
const Sib=require('sib-api-v3-sdk')
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

route.get('/forgetpass',(req,res)=>{
   
    res.render('forgetpass',{
        title:'forget password',
        massage:""

    })
})

route.post('/forgetpass',(req,res,next)=>{
    const email=req.body.email
    console.log(email)
    const client=Sib.ApiClient.instance
    const apiKey=client.authentications['api-key']
    apiKey.apiKey=process.env.API_KEY
    const transEmailApi=new Sib.TransactionalEmailsApi()

    const id=uuidv4();
    db.query(`insert into forgetpass(id,userid,isactive) 
 values('${id}','${email}',"no")`,(err,result)=>{
     if(err){
         console.log(err)
     }       
 } )

    const sender={
        email:'shivbanarasi0542@gmail.com',
    }
    const receiver=[
        {
        email:email
    }
]

    transEmailApi.sendTransacEmail({
        sender,
        to: receiver,
        subject:'change your password',
        textContent:'here is your link to change your password',
        htmlContent:`<a href="http://localhost:4000/forgetpass/${email}">link to reset password</a>`
    })
    .then(console.log)
    .catch(console.log)
    
})

route.get('/forgetpass/:email',(req,res)=>{
   const email=req.params.email
   db.query(`update forgetpass
   set isactive='yes' 
   where userid="${email}"`,(err,result)=>{
if(err){
   console.log(err)
}       
} )
    res.render('conform',{
        title:"reset password",
        massage:" ",
        email:email
    })
})

route.post('/resetpass/:email',(req,res)=>{
    const email=req.params.email;
    const password=req.body.password;
    const conpass=req.body.conpass;
    if(password===conpass){
        bcrypt.hash(password,10,(err,password)=>{
            db.query(`update user 
            set password='${password}' 
            where email="${email}"`,(err,result)=>{
        if(err){
            console.log(err)
        }       
    } )
    res.redirect(`/login`)
    console.log('password change')
})    
}else{
 res.render('conform',{
        title:'forget pass',
        massage:'password does not match',
        email:email
    })
}
})


module.exports=route;