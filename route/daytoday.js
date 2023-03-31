const express=require('express');
const bcrypt=require('bcrypt');
const route=express.Router();
const db=require('../mysql/connn')

route.get('/login/:email/daytoday/report',(req,res)=>{
    console.log('this is report page')
    res.render('daytoday',{
        title:'report',

    })
})


module.exports=route