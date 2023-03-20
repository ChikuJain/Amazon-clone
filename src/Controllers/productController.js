const productModel = require('../models/productModel')




let createProduct = async function(req,res){
try{
    let bodyData = req.body.data
    let createdData = await productModel.insertMany(bodyData)
    res.status(201).send({data:createdData})
}
catch(err){
    
}
}

let getProducts = async function(req,res){
    try{
        const productsData = await productModel.find();
        res.status(201).send({data:productsData})
    }catch(error){
        res.status(500).send({status:false,message:error.message})
    }
}

let getProductByParams = async function(req,res){
    try{
        const {id} = req.params;
        let product = await productModel.findOne({id:id})
        res.status(201).send({data:product})
    }catch(error){
        res.send({message:error})
    }
}

module.exports={createProduct,getProducts,getProductByParams}