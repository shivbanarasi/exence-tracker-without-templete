const express=require('express');
const bcrypt=require('bcrypt');
const route=express.Router();
const db=require('../mysql/connn')

route.get('/login/:email',(req,res)=>{
    const email=req.params.email;
    console.log('gmail='+email)
    db.query(`select * from user`,(err,naam)=>{
        //console.log("naam="+naam.name)
        db.query(`SELECT * FROM expence where user="${email}"` ,(err,out)=>{
        let tot=0;
        let name1='';
        let payment='';
        let date='';
        for(let i of naam){
            if(i.email===email){
                name1=i.name;
                payment=i.payment;
                console.log(name1)
                
            }
        }
for(let i of out){
tot+= i.amount;
}
db.query(`update user 
set total='${tot}' 
where email="${email}"`,(err,result)=>{
if(err){
console.log(err)
}       
})
//res.redirect(`/login/${email}`)
        res.render('home',{
            title:'home page',
            data:email,
            total:tot,
            show:"",
            payment:payment,
            premium:payment,
            lead:naam,
            res:out,
            nam:naam[0].name,
            
        })
    })
})

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
        //            
        res.redirect(`/login/${email}`)
                       
                    console.log('password matched')}
                  
                    
                  
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


module.exports=route;