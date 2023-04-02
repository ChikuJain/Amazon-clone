const express = require("express")
const router = express.Router()
var path = require("path");

const {createProduct,getProducts,getProductByParams} = require('../Controllers/productController')
const {createUser,userLogin,userLogout,getUserData} = require("../Controllers/userController")
const {createCart,updateCart,getCart,deleteProductFromCart} = require("../Controllers/cartController")
const {authentication} = require("../middleware/auth")

router.post("/api/products", createProduct)
router.get("/api/getproductsdata",getProducts)
router.get("/api/getproductsone/:id",getProductByParams)

router.post("/api/registeruser",createUser)
router.post("/api/login",userLogin)
router.get("/api/logout",authentication,userLogout)
router.get("/api/getuserdata",authentication,getUserData)

router.post("/api/addtocart/:id",authentication,createCart)
router.get("/api/getcartdata",authentication,getCart)
router.put("/api/updatecart",authentication,updateCart)
router.delete("/api/deleteproduct",authentication,deleteProductFromCart)

router.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../build/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })



module.exports = router;