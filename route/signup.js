const express=require('express');
const bcrypt=require('bcrypt');
const route=express.Router();
const db=require('../mysql/connn')

route.get('/',(req,res)=>{
    
    res.render('front',{
        title: 'home'
    })
})


const total=(id)=>{
    db.query(`select * from user where id="${id}"`,(err,result)=>{
        let tot=0;
        for(let i of result){
           tot+= i.amount;
        }
        console.log(tot)
        return tot;
    })
}


route.get("/deletedata/:id/:r",(req,res)=>{
    var del=req.params.id;
    const r=req.params.r
    console.log(del);
    db.query(`delete from expence where id="${del}"`,(err)=>{
        if(err){
            console.log(err);
        }else{
            
                db.query(`SELECT * FROM expence where user="${r}"` ,(err,out)=>{
                let tot=0;
for(let i of out){
   tot+= i.amount;
}
                res.render('home',{
                    title:'home page',
                    data:r,
                    total:tot,
                    res:out
                })
            })
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
                    db.query(`select * from user where email="${email}"`,(err,naam)=>{
                        console.log("naam="+naam.name)
                        db.query(`SELECT * FROM expence where user="${email}"` ,(err,out)=>{
                        let tot=0;
        for(let i of out){
           tot+= i.amount;
        }
                        res.render('home',{
                            title:'home page',
                            data:email,
                            total:tot,
                            res:out,
                            nam:naam[0].name
                        })
                    })
                   
                    console.log('password matched')})
                    
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
    
    db.query(`SELECT * FROM expence where user="${user}"` ,(err,out)=>{
        let tot=0;
            for(let i of out){
               tot+= i.amount;
            }
        res.render('home',{
            title:'home page',
            data:user,
            total:tot,
            res:out,
            nam:naam[0].name
        })
    })
 })
 
 
})
route.get('/forgetpass',(req,res)=>{
    res.render('forgetpass',{
        title:'forget password',
        massage:""

    })
})

route.post('/forgetpass',(req,res)=>{
    const email=req.body.email;
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
 res.render('forgetpass',{
        title:'forget pass',
        massage:'password does not match'
    })
}
})

                   



module.exports=route;