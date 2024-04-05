const Category = require('../models/category-model')
const Brand = require("../models/brand-model")
const categoryCtrl ={}

categoryCtrl.list =async(req,res)=>{
    try{
        const category = await Category.find()
        res.json(category)
    }
    catch(err)
    {
        res.json(err)
    }
}

//Create 
categoryCtrl.create=async(req,res)=>{
      try{
        const body = req.body
        //console.log(body)
        const file = req.file
        //console.log(file)
        if(!file)
        {
            return res.status(401).json({errors : "No file uploaded"})
        }
        const imagePath = file.path
        //console.log(imagePath)
        body.imagePath = imagePath
        const category = new Category(body)
        console.log(category)
        category.BrandId= req.body.BrandId
        //console.log(category.BrandId)
        await category.save()
        //console.log(category)
        return res.json(category)
    }
    catch(err){
        console.log(err)
        return res.json(err)
    }
}

//Update 
categoryCtrl.update=async(req,res)=>{
    const id = req.params.id
    const body = req.body
    //console.log(id)
    const file = req.file
    //console.log(file)
    if(!file)
    {
        return res.status(401).json({errors : "file is not uploaded"})
    }
    try{
        const imagePath = req.file.filename
        const category = await Category.findByIdAndUpdate(id,{...body,imagePath},{new : true, runValidator : true})
        console.log(category)
        res.json(category)
    }
    catch(err)
    {   
        console.log(err)
        res.json(err)
    }
}

//Delete
categoryCtrl.delete=async(req,res)=>{
    const id = req.params.id
    try{ 
        const category = await Category.findByIdAndDelete(id)
        res.json(category)
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
}

module.exports = categoryCtrl