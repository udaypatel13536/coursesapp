const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel ,adminRequestModel} = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD} = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const {checkImformtion} = require("../middleware/zodchack")
const bcrypt = require('bcrypt');





adminRouter.post("/signup",checkImformtion, async function(req, res) {
    const { email, password, firstName, lastName } = req.body; 
    const hashPassword = await bcrypt.hash(password,3)
    
    const respons = await adminModel.create({
        email : email,
        password : hashPassword,
        firstName : firstName,
        lastName: lastName
    })
    const token  = jwt.sign({
        id : respons._id
    },JWT_ADMIN_PASSWORD)

    const adminRequest = await adminRequestModel.create({
        adminId : respons._id
     })


    res.json({
        message: "Signup succeeded",
        token : token 
    })
})

adminRouter.post("/signin", async function(req, res) {
    const { email, password} = req.body;
    const adminfind = await adminModel.findOne({
        email : email
    })
    if(!adminfind){
        res.json({
            massage : "pls creat account admin not found !"
     
        })
    }
    const passwordMatch = await bcrypt.compare(password,adminfind.password)
    
    if(!passwordMatch){
        res.json({
            massage : "Incorrect Creds! "
        })
    }else{
        token = jwt.sign({id: adminfind._id},JWT_ADMIN_PASSWORD)
        res.json({
            massage : "you are signin !",
            token : token 
        })
    }
    
})



adminRouter.post("/course", adminMiddleware, async function(req, res) {
    const { title, description, imageUrl, price } = req.body;
    const adminId = req.userId;

    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price,
        creatorId : adminId
    })

    res.json({
        message: "Course created",
        courseId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId, 
        creatorId: adminId 
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price
    })

    res.json({
        message: "Course updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware,async function(req, res) {
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}