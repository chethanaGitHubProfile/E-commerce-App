const Brand = require("../models/brand-model")
const BrandValidationSchema = {
    name :{
        in : ['body']
    },
    description :{
        in : ['body']
    },
    BrandId : {
        in : ['body']
    },
    imagePath : String
}
module.exports = BrandValidationSchema