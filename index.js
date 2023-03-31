const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');
const app=express();
const { json } = require('express');
const routesignup=require('./route/signup')
const payment=require('./route/payment');
const premiumuser=require('./route/premium')
const login=require('./route/login')
const forgetpass=require('./route/forgetpass')
const report=require('./route/daytoday')
const port=4000;

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

app.set("view engine","ejs");



app.use(routesignup);

app.use(payment);

app.use(premiumuser);

app.use(login);

app.use(forgetpass);

app.use(report)



app.listen(port,()=>{
    console.log(`listning to the port : ${port}`);
})