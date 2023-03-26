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
        title:'sign up',
        massage:""
    })
    //const email=req.body.email;
   
})

route.get('/login',(req,res)=>{
    res.render('login',{
        title:'login page',
        massage:''
    })
})

route.post('/login',async(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    db.query(`select password from user where email = '${email}'`,(err,data)=>{
            console.log(data[0].password);
            if(data[0].password===password){
                res.render('home',{
                    title:'home page'
                });
            }
            else{
                res.render('login',{
                    title:'login page',
                    massage:'you have entered wrong password'
                })
            }
            

    });

     
})

route.post('/signup',(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    const password=req.body.password;
    const conpass=req.body.conpass;
          db.query('select email from user',(err,data)=>{
            for(let i of data){
                if((password===conpass)&&(email===i.email)){
                    console.log('password matched and email is unique')
                    db.query(`insert into user(name,email,phone,password,conpass) 
                values('${name}','${email}',${phone},${password},${conpass})`,(err,result)=>{
                    if(err){
                        console.log(err)
                    }       
                } )
                res.redirect('/')
                }else{
                    
                        res.render('signup',{
                            title:'signup page',
                            massage:'password doesnot match'
                
                        
                    }  )
                } 
            }
            
          })  
       
   });
   



module.exports=route;