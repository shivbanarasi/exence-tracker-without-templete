const express=require('express');
const bcrypt=require('bcrypt');
const route=express.Router();
const db=require('../mysql/connn')

route.get('/',(req,res)=>{
    
    res.render('front',{
        title: 'home'
    })
})




route.get("/deletedata/:id/:r",(req,res)=>{
    var del=req.params.id;
    const r=req.params.r
    console.log(del);
    db.query(`delete from expence where id="${del}"`,(err)=>{
        if(err){
            console.log(err);
        }else{



res.redirect(`/login/${r}`)
               
         }        
        })   
})

route.get('/signup',(req,res)=>{
    res.render('signup',{
        title:'sign up',
        massage:""
    })
    //const email=req.body.email;
   
})


route.post('/signup',(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    const password=req.body.password;
    const conpass=req.body.conpass;
    
    console.log('this')
    
          db.query('select email from user',(err,data)=>{
            const uservalid=()=>{
                for(let i of data){
                    if(email===i.email){
                        console.log('password matched and email is unique')
                        return true;  
            }
        }
        return false;
    }
    console.log(uservalid());
    if(uservalid()){
        res.render('signup',{
            title:'signup page',
            massage:'this user already exist'
        })
    }
    else{
        if(password===conpass){
            bcrypt.hash(password,10,(err,password)=>{
                db.query(`insert into user(name,email,phone,password) 
        values('${name}','${email}',${phone},'${password}')`,(err,result)=>{
            if(err){
                console.log(err)
            }       
        } )
        res.redirect(`/login`)
    })    
}else{
    res.render('signup',{
        title:'signup page',
        massage:'password doesnot match'
})
}
}
})
})


route.post("/addexp",(req,res)=>{
    
    const discription=req.body.discription
    const category=req.body.category
    const amount=req.body.amount
    const user=req.body.email
    console.log(discription,category,amount)
 db.query(`insert into expence(discription,category,amount,user) 
 values('${discription}','${category}',${amount},'${user}')`,(err,result)=>{
     if(err){
         console.log(err)
     }       
 } )
 db.query(`select * from user where email = '${user}'`,(err,naam)=>{
    
   
    res.redirect(`/login/${user}`)
        
 }) 
})


route.get('/api/userdata',(req,res)=>{
    db.query('select * from user',(err,result)=>{
        console.log(result);
        for(let i of result){
            console.log(i.total);
            result=i.total
            }
        
    })
})



module.exports=route;