const express = require("express")
const router = express.Router()
const {createProduct,getProducts,getProductByParams} = require('../Controllers/productController')
const {createUser,userLogin,userLogout,getUserData} = require("../Controllers/userController")
const {createCart,updateCart,getCart,deleteProductFromCart} = require("../Controllers/cartController")
const {authentication} = require("../middleware/auth")

router.post("/products", createProduct)
router.get("/getproductsdata",getProducts)
router.get("/getproductsone/:id",getProductByParams)

router.post("/registeruser",createUser)
router.post("/login",userLogin)
router.get("/logout",authentication,userLogout)
router.get("/getuserdata",authentication,getUserData)

router.post("/addtocart/:id",authentication,createCart)
router.get("/getcartdata",authentication,getCart)
router.put("/updatecart",authentication,updateCart)
router.delete("/deleteproduct",authentication,deleteProductFromCart)

module.exports = router;