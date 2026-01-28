const {adminModel} = require("../db");


async function SuperadmineMiddleware (req,res,next){
    const adminId = req.userId
    const issuperadmin = await adminModel.findOne({_id : adminId , superadmin : true})
   try{

       if(!issuperadmin){
           res.json({
               massage : "you are NOT superadmin !"
            })
        }else{
            next()
            
        }
    }catch(er){
        console.log(er)
    }
}

module.exports={
    SuperadmineMiddleware
}