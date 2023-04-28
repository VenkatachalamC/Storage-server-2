const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const multer=require('multer');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const storage=multer.memoryStorage();
const upload=multer({storage:storage});
const UserModel=require('./models/users');
const DocumentModel=require('./models/documents')
const port =process.env.port || 6000

mongoose.connect('mongodb+srv://test:test123@cluster0.8w2bjpt.mongodb.net/cloud').then(result=>app.listen(port));

//ok
app.post('/signup',(req,res)=>{
    UserModel.find({name:req.body.name}).then(result=>{
        if(result.length==1){
            res.json({status:"user already exists"})
        }
        else{
            const User=new UserModel({
                userid:req.body.userid,
                name:req.body.name,
                Password:req.body.Password
            })
            User.save()
            .then((result)=>{res.json({status:"ok"});})
            .catch((err)=>res.json({status:"error"}))
        }
    })
})
//ok
app.post('/document',upload.single('file'),(req,res)=>{
    const Doc = new DocumentModel({
        userid: req.body.userid,
        fileName: req.body.fileName,
        filetype: req.body.filetype,
        Document: {
            data: req.body.data,
            contentType: req.body.filetype
        }
    })
    Doc.save()
        .then(result => res.json({ status: "file uploaded successfully" }))
})
//ok
app.post('/restore',(req,res)=>{
    DocumentModel.findOneAndUpdate({fileName:req.body.fname,userid:req.body.uid},{$set:{Deleted:false}})
    .then(result=>res.json({status:"ok"}))
})

//ok
app.post('/rename',(req,res)=>{
    DocumentModel.findOneAndUpdate({
        userid:req.body.userid,
        fileName:req.body.filename,
    },{$set:{
        fileName:req.body.newname
    }}).then(result=>res.json({status:'ok'})).catch(err=>res.json({status:'error'}))
})
//ok
app.delete('/deactivate',(req,res)=>{
    UserModel.findOneAndDelete({userid:req.body.uid})
    .then(result=>{
        DocumentModel.deleteMany({userid:req.body.uid}).then(result=>{
            res.json({status:"ok"})
        })
    })
})

//ok
app.delete('/Delete',(req,res)=>{
    DocumentModel.findOneAndUpdate({fileName:req.body.name,userid:req.body.uid},{$set:{Deleted:true}}).then(result=>res.json({status:"ok"}))
})

//ok
app.delete('/permanentdelete',(req,res)=>{
    DocumentModel.findOneAndDelete({userid:req.body.uid,fileName:req.body.name})
    .then(result=>res.json({status:"ok"}))
})