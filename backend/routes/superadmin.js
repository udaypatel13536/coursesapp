const { Router } = require("express");
const superadminRouter = Router();
const {adminMiddleware} = require("../middleware/admin")
const {SuperadmineMiddleware} = require("../middleware/superadmin");
const {adminRequestModel,adminModel,superadminModel} = require("../db")
const {JWT_ADMIN_PASSWORD,FirstSuperadminCoad} = require("../config")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const admin = require("./admin");



superadminRouter.get("/adminRequest",adminMiddleware,SuperadmineMiddleware, async function(req,res){
    const id = req.userId
    const adminRequests = await adminRequestModel.find({})
    if(!adminRequests){
        res.json({
            massage : "there is no admin verify request !"
        })
    }else{
        res.json({
            massage : "you are in superadmin",
            id : id,
            requests : adminRequests
            
        })
    }
})

superadminRouter.put("/adminRequest",adminMiddleware,SuperadmineMiddleware,async function(req,res){
    const updateStatus = req.body.updateStatus
    const adminId = req.body.adminId 
    const superadminId = req.userId
    const adminRequest = await adminRequestModel.findOneAndUpdate({adminId : adminId},{requestStatus : updateStatus,superadminId },{new : true})
    console.log(adminRequest)
    if(updateStatus ==="accept"){
        await adminModel.findByIdAndUpdate(adminId,{verify: true})
    }
    
    res.json({
        massage : `Update status success fully to ${updateStatus}`,
        adminRequest : adminRequest
    })

    
})

superadminRouter.post("/setup",async function(req,res){
   const {email,password,firstName,lastName,superadminCoad} = req.body;
   const coadForFirstsuperadmin = FirstSuperadminCoad
   const SuperadminExist= await adminModel.find({superadmin : true})
        if (SuperadminExist.length === 0){
            if(superadminCoad === coadForFirstsuperadmin){
                const hashPassword = await bcrypt.hash(password,10)
                const admin = await adminModel.create({
                        email : email,
                        password : hashPassword,
                        firstName : firstName,
                        lastName: lastName,
                        verify: true,
                        superadmin :true
                })
                if(!admin){
                    res.json({
                        massage : "error in cannection "
                    })
                }
                const token = jwt.sign({id : admin._id},JWT_ADMIN_PASSWORD)
                res.json({
                    massage : "you are signup as superadmin success fully!",
                    admin,
                    token
                })
                
            } else{
                res.json({
                    massage :"your superadmin code is invalid!"
                })
            }
        }else{
            const machsuperadmincoad = await superadminModel.findOne({coad :superadminCoad,newSuperadminemail : email})
            if(!machsuperadmincoad){
                res.json({
                    massage : "incorect superadmin Coad or email Id!",
                })
            }else{
                const hashPassword = await bcrypt.hash(password,5)
                const respon = adminModel.create({
                   email : email,
                    password : hashPassword,
                    firstName : firstName,
                    lastName: lastName,
                    verify: true,
                    superadmin :true 
                })
                if(!respon){
                    res.json({
                        massage: "error in cannection!"
                    })
                }
                const token = jwt.sign({id:respon._id},JWT_ADMIN_PASSWORD)
                res.json({
                    massage: "you are signup as Super Admin2 !",
                    token
                })
            }
             
        }
    

})

superadminRouter.post("/generate",adminMiddleware,SuperadmineMiddleware,async function (req,res){
    const adminId = req.userId;
    const newSuperadminemail = req.body.newEmail
    const rendamString = Math.random().toString(36).substring(2,10)
    await superadminModel.create({
        coad :rendamString,
        newSuperadminemail : newSuperadminemail,
        superadminId :adminId
    })
    res.json({
        massage : `New code generated for this email Id ${newSuperadminemail}`,
        rendamString
    })
})

module.exports ={
   superadminRouter: superadminRouter
}