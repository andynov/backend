const ProductModel = require("../models/product.model.js");

class ProductManager {
    async addProduct(newObject) {
        try{
            const {title, description, prize, img, thumbnails, code, stock, category} = newObject;

        if(!title || !description || !prize || !code || !stock || !category){
            console.log("Complete all fields, please");
            return;
        }

        const productExist = await ProductModel.findOne({code: code});
        if (productExist) {
            console.log("Don't repeat the code, please");
            return;
        }

        const newProduct = new ProductModel ({
            title,
            description,
            code,
            img,
            prize,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || [],
        });

        await newProduct.save();

    } catch (error) {
        console.log("Error adding product", error);
        throw error;
    }
    }

    async getProducts() {
        try{
            const products = await ProductModel.find();
            return products;

        } catch(error) {
            console.log("Error getting products", error);

        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id)

            if (!product){
                console.log("Didn't find the product");
                return null;
            }

            console.log("Product found");
            return product;

        } catch (error) {
            console.log("Error getting product by id")
        }
    }

    async updateProduct(id, productUpdated) {
        try{

            const updated = await ProductModel.findByIdAndUpdate(id, productUpdated);

            if(!updated){
                console.log("Didn't find the product");
                return null;
            }

            console.log("Product updated succesfully");
            return updated;
        } catch(error){
            console.log("Error updating the product", error);
        }
    }

    async deleteProduct(id) {
        try{
            const deleted = await ProductModel.findByIdAndDelete(id)
            if (!deleted){
                console.log("Din't find the product");
                return null;
            }
            console.log("Product deleted succesfully");
        } catch (error) {
            console.log("Error deleting product", error)
        }
    }
}

module.exports = ProductManager;