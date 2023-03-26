const express=require('express');
const bcrypt=require('bcrypt');
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
                bcrypt.compare(password, pass, function(err, result) {
                  if(result){
                    res.redirect('/');
                    console.log('password matched')
                  }
                  else{
                    res.render('login',{
                        title:'login page',
                        massage:'password incorrect'
                    })
                }
                })
            })
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
        res.redirect('/')
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
            
                   



module.exports=route;