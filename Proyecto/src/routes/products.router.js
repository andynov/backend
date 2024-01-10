const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

// Routing:

// Limiting number of array elements and show them:

router.get("/products", async (req, res) => {
    try{
        const limit = req.query.limit;
        const arrayProducts = await productManager.getProducts();

        if (limit) {
            res.json (arrayProducts.slice(0, limit));
        } else{
            res.json(arrayProducts);
        }

    } catch(error) {
        console.log("Error getting products", error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

// Returning element of array by ID:

router.get("/products/:pid", async (req, res) => {
    
    const pid = req.params.pid

    try{
        const product = await productManager.getProductById(parseInt(pid));

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
    try{
        const newProductData = req.body;
        const newProduct = await productManager.addProduct(newProductData);
        res.json(newProduct);

    } catch(error) {
        console.error("Error adding Product to cart", error)
        res.status(500).json({error: "Internal error server"});
    }
})

// Update Product field:

router.put("/products/:pid", async (req, res) =>{
    const pid = req.params.pid;
    const {title, description, price, thumbnail, code, stock, category} = req.body;
    try{
        const productUpdated = await productManager.updateProduct(parseInt(pid), {title, description, price, thumbnail, code, stock, category});
        res.json(productUpdated)
    } catch(error){
        console.error("Error updating Product", error);
        res.status(500).json({error: "Internal Server Error"})
    }
})

// Delete Product:

router.delete("/products/:pid", async (req, res) =>{
    const {pid} = req.params;
    try{
        await productManager.deleteProduct(parseInt(pid));
        res.send("Successful deletion")
    } catch(error){
        console.error("Error deleting Product", error);
        res.status(500).json({error: "Internal Server Error"})
    }
})

module.exports = router;