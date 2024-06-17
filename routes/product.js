const express = require("express");
const { verifyTokenAndAdmin } = require("./verifyToken");
const Product = require("../models/Product");
const router = express.Router();


// Create a New Product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Update product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params._id,
            { $set: req.body },
            { new: true }
        )
        res.status(200).json(updateProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})

// Delete product
router.delete("/:id", verifyTokenAndAdmin, async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted ...");
    } catch(err) {
        res.status(500).json(err);
    }
})

// Get Product
router.get("/find/:id", async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json("Product not found ...");
        res.status(200).json(product)
    }catch(err) {
        res.status(500).json(err);
    }
})

// Get all products
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if(qNew) {
            products = await Product.find().sort({createdAt: -1}).limit(1);
        } else if(qCategory) {
            products = await Product.find({
                categories:{
                    $in:[qCategory]
                }                 
            })
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);

    }catch(err) {
        res.status(500).json(err);
    }
})



module.exports = router