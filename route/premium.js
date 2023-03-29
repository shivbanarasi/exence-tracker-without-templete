const express=require('express');
const route=express.Router();
const db=require('../mysql/connn')
 
route.get('/login/:email/:lead',(req,res)=>{
    const email=req.params.email;
    const lead=req.params.lead;
    console.log('lead='+lead)
    console.log('gmail='+email)
    db.query(`select * from user order by total desc`,(err,naam)=>{
        //console.log("naam="+naam.name)
        db.query(`SELECT * FROM expence where user="${email}"` ,(err,out)=>{
        let tot=0;
        let name1='';
        for(let i of naam){
            if(i.email===email){
                name1=i.name;
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
            show:lead,
            payment:'success',
            premium:" ",
            lead:naam,
            res:out,
            nam:naam[0].name
        })
    })
})

})


module.exports=route;
