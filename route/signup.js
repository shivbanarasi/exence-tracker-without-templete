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
    db.query('select email from user',async(err,data)=>{
        const userfind=()=>{
            for(let i of data){
                console.log(i.email);
                if(email===i.email){
                    return true
                }
            }
            return false;
        }
        console.log(userfind());
        if(userfind()){
            db.query(`select password from user where email = '${email}'`,async(err,data)=>{
                const pass=await data[0].password;
                console.log(pass);
                if(pass===password){
                    res.redirect('/')
                }
                else{
                    res.render('login',{
                        title:'login page',
                        massage:'password incorrect'
                    })
                }
        });
       // res.send('true')
        }
        else  {
            res.render('login',{
                title:'login page',
                massage:'user doesnot exist'
            })
        }
      })
    })  

route.post('/signup',(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    const password=req.body.password;
    const conpass=req.body.conpass;
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
})
            
                   



module.exports=route;