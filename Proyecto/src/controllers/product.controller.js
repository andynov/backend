const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

class ProductController {

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            await productRepository.addProduct(newProduct);

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            const products = await productRepository.getProducts(limit, page, sort, query);
           
            res.json(products);
        } catch (error) { 
            res.status(500).send("Error");
        }
    }

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const searched = await productRepository.getProductById(id);
            if (!searched) {
                return res.json({
                    error: "Producto does'nt find"
                });
            }
            res.json(searched);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productUpdated = req.body;

            const result = await productRepository.updateProduct(id, productUpdated);
            res.json(result);
        } catch (error) {
            res.status(500).send("Error updating product");
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        const user = req.user; 
        try {
            let response = await productRepository.deleteProduct(id, user);

            res.json(response);
        } catch (error) {
            res.status(500).send("Error deleting product");
        }
    }
}

module.exports = ProductController; 