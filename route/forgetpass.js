const express=require('express');
const bcrypt=require('bcrypt');
const route=express.Router();
const Sib=require('sib-api-v3-sdk')
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const db=require('../mysql/connn')


route.get('/forgetpass',(req,res)=>{
   
    res.render('forgetpass',{
        title:'forget password',
        massage:""

    })
})

route.post('/forgetpass',(req,res,next)=>{
    const id=uuidv4();
    const email=req.body.email
    db.query(`insert into forgetpass(id,userid,isactive) 
    values('${id}','${email}',"false")`,(err,result)=>{
        if(err){
            console.log(err)
        }       
    } )

    const client=Sib.ApiClient.instance
    const apiKey=client.authentications['api-key']
    apiKey.apiKey=process.env.API_KEY
    const transEmailApi=new Sib.TransactionalEmailsApi()

    
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
        htmlContent:`<a href="http://localhost:4000/forgetpass/${id}">link to reset password</a>`
    })
    .then(console.log)
    .catch(console.log)
    res.redirect('/login')
   
   
    
})

route.get('/forgetpass/:id',(req,res)=>{
   const id=req.params.id
   db.query(`update forgetpass
   set isactive='true' 
   where id="${id}"`,(err,result)=>{
if(err){
   console.log(err)
}      
} )
   console.log(id);
db.query(`select userid from forgetpass where id=${id}`,(err,result)=>{
   console.log(result)
   
})
    res.render('conform',{
        title:"reset password",
        massage:" ",
        email:id
    })
})

route.post('/resetpass/:id',(req,res)=>{
    const id=req.params.id;
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