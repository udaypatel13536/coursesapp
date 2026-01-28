const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email: { type: String, unique: true , require :true },
    password: {type : String , require : true },
    firstName: String,
    lastName: String,
});

const adminSchema = new Schema({
    email: { type: String, unique: true , require : true },
    password: String,
    firstName: String,
    lastName: String,
    verify : {
        type :boolean,
        default : false
    },
    superadmin : {
        type : boolean,
        default : false
    }
});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
});

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId
});

const superadminSchema = new Schema({
    coad :string,
    newSuperadminemail : string,
    superadminId : ObjectId
})

const adminRequestSchema = new Schema ({
    adminId : ObjectId,
    superadminId : ObjectId,
    requestStatus :{
        type : string,
        enum : ["accept","reject","pending","block"],
        default : "pending"
    }
},{timestamps : true})


const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);
const superadminModel = mongoose.model("superadmin",superadminSchema);
const adminRequestModel = mongoose.model("adminRequest",adminRequestSchema)

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel,
    superadminModel,
    adminRequestModel
}