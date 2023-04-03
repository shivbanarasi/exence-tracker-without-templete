const express=require('express');
const bcrypt=require('bcrypt');
const AWS=require('aws-sdk')
const fs=require('fs');
const route=express.Router();
const db=require('../mysql/connn')



route.get('/login/:email/daytoday/report',async(req,res)=>{
    const email=req.params.email
    console.log('report='+email)
    console.log('this is report page')
   
    db.query(`select * from expence where user='${email}'`,async(err,data)=>{
        const datae=JSON.stringify(data);
        const filename=`${email}expence/${new Date}.txt`;
        const BUCKET_NAME='expencetracking';
        const IAM_USER_KEY='AKIAWEPRE6VJ5DTNNYH6';
        const IAM_USER_SECRET='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';
    
        let s3bucket=new AWS.S3({
            accessKeyId:IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRET,
            bucket:BUCKET_NAME
        })
    
        s3bucket.createBucket(()=>{
            var params={
                Bucket:BUCKET_NAME,
                Key:filename,
                Body:datae,
                ACL:'public-read'
            }
           
                s3bucket.upload(params,(err,s3response)=>{
                    if(err){
                        console.log('something went wrong',err)
                       
                    }else{
                        console.log('success',s3response.Location)
                      const fileURL=s3response.Location;
                      console.log(fileURL)
       
        let total=0; 
        let income=0;
        let saving=0;
        for(let i of data){
            if(i.category!='salary'){
                total+=i.amount;
            }
            
            if(i.category==='salary'){
                income+=i.amount;
            }
           
        }  
        saving=income-total; 
          res.render('daytoday',{
            title:'report',
            data:data,
            total:total,
            income:income,
            saving:saving,
            fileURL:fileURL

         })
                    }
              
            })
           
    
        })
        
        
    })
})


module.exports=route