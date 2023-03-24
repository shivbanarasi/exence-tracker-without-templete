const express=require('express');
const route=express.Router();
const db=require('../mysql/connn')

route.get('/',(req,res)=>{
    res.render('home',{
        title: 'home'
    })
})

route.get('/signup',(req,res)=>{
    res.render('signup',{
        title:'sign up'
    })
})

route.post('/signup',(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    db.query(`insert into user(name,email,phone) 
    values('${name}','${email}',${phone})`,(err,result)=>{
        if(err){
            console.log(err)
        }       
    } )
    res.redirect('/')
})

module.exports=route;