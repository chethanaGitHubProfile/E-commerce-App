const category = require("../models/category-model")
const categorySchema = {
    name : {
        in :['body']
    },
    BrandId :{
        in : ['body']
    },
    imagePath : String
}
module.exports = categorySchema