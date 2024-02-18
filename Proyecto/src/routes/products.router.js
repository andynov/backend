const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager( );

// Routing:

router.get("/products", async (req, res) => {
    try {

        const { limit = 10, sort, page = 1, query } = req.query;

        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error getting products", error);
        res.status(500).json({
            status: 'error',
            error: "Internal Server Error"
        });
    }
});


router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.json({
                error: "Product didn't find"
            });
        }

        res.json(product);
    } catch (error) {
        console.error("Error getting product by id", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});


router.post("/products", async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Product added succesfully"
        });
    } catch (error) {
        console.error("Error adding the product", error);
        res.status(500).json({
            error: "Internal error server"
        });
    }
});


router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const productUpdated = req.body;

    try {
        await productManager.updateProduct(id, productUpdated);
        res.json({
            message: "Product updated succesfully"
        });
    } catch (error) {
        console.error("Error updating the product", error);
        res.status(500).json({
            error: "Internal error server"
        });
    }
});
 

router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        res.json({
            message: "Product deleted succesfully"
        });
    } catch (error) {
        console.error("Error deleting the product", error);
        res.status(500).json({
            error: "Internal Error Server"
        });
    }
});

module.exports = router;