const express = require("express");
const router = express.Router();

const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager( );

// Routing:

// Limiting number of array elements and show them:

router.get("/products", async (req, res) => {
    try{
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            res.json (products.slice(0, limit));
        } else{
            res.json(products);
        }

    } catch(error) {
        console.log("Error getting products", error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

// Returning element of array by ID:

router.get("/products/:pid", async (req, res) => {
    
    const id = req.params.pid

    try{
        const product = await productManager.getProductById(id);

        if (!product) {
            res.json({error: "Don't get the product"});
        } else{
            return res.json(product);
        }

    } catch(error){
        console.log("Error getting product by id", error);
        res.status(500).json({error: "Error al retornar el elemento"})
    }
})

// Add product from POST:

router.post("/products", async (req, res) =>{
    const newProduct = req.body;
    try{
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Product added sucessfully"});
    } catch(error) {
        console.error("Error adding Product to cart", error)
        res.status(500).json({error: "Internal error server"});
    }
})

// Update Product field:

router.put("/products/:pid", async (req, res) =>{
    const id = req.params.pid;
    const productUpdated = req.body;
    try{
        await productManager.updateProduct(id, productUpdated);
        res.status(201).json({
            message: "Product update succesfully"});
    } catch(error){
        console.error("Error updating Product", error);
        res.status(500).json({error: "Internal Server Error"})
    }
})

// Delete Product:

router.delete("/products/:pid", async (req, res) =>{
    const id = req.params.pid;
    try{
        await productManager.deleteProduct(id);
        res.json({
            message: "Product deleted succesfully"
        })
    } catch(error){
        console.error("Error deleting Product", error);
        res.status(500).json({error: "Internal Server Error"})
    }
})

module.exports = router;