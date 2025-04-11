let mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },description:{
        type:String,
        default:""
    },
    slug:String
},{
    timestamps:true
})
module.exports = mongoose.model('category',categorySchema)
