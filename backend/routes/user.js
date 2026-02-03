const { Router} = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const  { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");
const {checkImformtion} = require('../middleware/zodchack')
const bcrypt = require('bcrypt')


const userRouter = Router();

userRouter.post("/signup", checkImformtion, async function(req, res) {
   const{firstName,lastName , email, password}= req.body
   const hashPassword = await bcrypt.hash(password,3)
   try{

       const respoes = await userModel.create({
           firstName :firstName,
           lastName : lastName,
           email : email,
           passwrd : hashPassword
        })
        if(!respoes){
            res.json({
                massage : "error in cannection " 
            })
        }
        const token = jwt.sign({
            id : respoes._id.toString()
        },JWT_USER_PASSWORD)
        
        
        res.json({ 
            message: "Signup succeeded",
            token : token,
            response : respoes
        })
    }catch(err){
        res.json({
            massage : "error in try block"
        })
    }
})

userRouter.post("/signin",async function(req, res) {
    const {email,password} =req.body;
    const userFind = await userModel.findOne({
        email :email
    })
    if(!userFind){
        res.json({
            massage : "You Don't have account" 
        })}
    const passwordMatch = await bcrypt.compare(password,userFind.password)
        if(!passwordMatch){
            res.json({
                massage : "Incorrect Creds! "
            })
        }else{
            const token  = jwt.sign({
                id : userFind._id
            },JWT_USER_PASSWORD)
            res.json({
                massage : "You are signin !",
                token : token
            })
        }
})

userRouter.post("/purchase", userMiddleware, async function(req, res) {
   const { userId } = req.userId;
   const courseId = req.body.courseId
   const courseDetali = await courseModel.findById(courseId)
   await purchaseModel.create({
    userId,courseId
   })

    res.json({
        massage : "sucessflly purchase course",
        courseDetali : courseDetali

    })
})

module.exports = {
    userRouter: userRouter
}