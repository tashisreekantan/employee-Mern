const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Body_parser = require("body-parser")
const express = require("express")
const { registerModel } = require('./model/Register.js');
const { adminModel } = require("./model/admin.js")
const jwt = require("jsonwebtoken")

const app = express()



app.use(Cors())
app.use(Body_parser.json())
app.use(Body_parser.urlencoded({extended: true}))


require('./database/connection.js')



app.post('/register',async(req,res) => {
    var data = new registerModel(req.body)
    data.save(
        res.json({msg : 'Success'})
        
    )
})
app.post('/viewall',async(req,res) =>{
    let data = await registerModel.find()
    res.json(data)
    console.log(data)
})


app.post('/adminRegister',async(req,res) => {
    var data = new adminModel(req.body)
    data.save(
        res.json({msg : 'Success'})
    )
})
app.post('/adminLogin',async(req,res)=>{
    let username = req.body.username
    let password = req.body.password

    let user = await adminModel.findOne({username : username})
    console.log(user)
    if(!user){
        res.json({msg:"user not found"})
    }
    try {
        if (user.password == password) {
            console.log("going to generate token")
            console.log(user._id)
            // res.json({msg:"login success"})
            jwt.sign({email:username,id:user._id},"Umesh",{expiresIn:"1d"},
            (error,token)=>{
                console.log("token generating")
                if (error) {
                    res.json({msg:"Token not generated"})
                } else {
                    res.json({msg:"login successful",token:token,data:user})
                }
            }
            )
        
        } else {
            res.json({msg:"login failed"})
        }
    } catch (error) {
        
    }
})
app.post('/employeeLogin',async(req,res)=>{
    let email = req.body.email
    let phone = req.body.phone

    let user = await registerModel.findOne({email : email})
    console.log(user)
    if(!user){
        res.json({msg:"user not found"})
    }
    try {
        if (user.phone == phone) {
            res.json({msg:"login successful"})
            location.replace('/')
        } else {
            res.json({msg:"login failed"})
        }
    } catch (error) {
        
    }
})

app.post('/deleteEmployee', async (req,res)=>{

    const data = await registerModel.findByIdAndDelete(req.body)
    console.log(req.body)
    console.log(data)
    jwt.verify(req.body.token,"Umesh",
    (error,decoded)=>{
        if (decoded && decoded.email) {
        
            res.json({status:'Deleted Successfully'})
            
        } else {
            res.json({status:"Unauthorized User"})
            res.json(error)
        }
    })
})



app.post('/update', async(req,res)=>{
    console.log(req.body._id)
    let data = await employeeModel.findOneAndUpdate({"_id": req.body._id},req.body)
    console.log(data)
    jwt.verify(req.body.token,"employeeapp",
    (error,decoded)=>{
        if (decoded && decoded.email) {
            
            res.json({status:'Data Updated'})
            
        } else {
            res.json({status:"Unauthorized User"})
        }
    })
})






app.listen(5000, () => {
    console.log("Server Running...in port 5000 ");
})