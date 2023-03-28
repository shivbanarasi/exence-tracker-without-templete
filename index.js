const express=require('express');
const bodyparser=require('body-parser');

const app=express();
const { json } = require('express');
const routesignup=require('./route/signup')
const payment=require('./route/payment');
const premiumuser=require('./route/premium')
const port=4000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

app.set("view engine","ejs");



app.use(routesignup);

app.use(payment);

//app.use(premiumuser)



app.listen(port,()=>{
    console.log(`listning to the port : ${port}`);
})