const mongoose = require('mongoose')
const {Schema,model} = mongoose
const CategorySchema = new Schema({
    name :[String],
    BrandId :{
        type : Schema.Types.ObjectId,
        ref : "Brand"
    },
    status : {type : String, default : "active"},
    imagePath : String
},{timestamps : true})
const Category = model('Category',CategorySchema)
module.exports = Category 