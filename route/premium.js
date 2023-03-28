const express=require('express');
const route=express.Router();
const db=require('../mysql/connn')
 
route.get('/leaderboard',(req,res)=>{
    res.render('home',{
        
    })
})

module.exports=route;
