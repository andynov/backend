const ProductModel = require("../models/product.model.js");

class ProductRepository {
    async addProduct({title, description, price, img, thumbnails, code, stock, category, owner}) {
        try{
        if(!title || !description || !price || !code || !stock || !category){
            console.log("Complete all fields, please");
            return;
        }

        const productExist = await ProductModel.findOne({code: code});
        if (productExist) {
            console.log("Don't repeat the code, please");
            return;
        }

        console.log("Owner", owner);

        const newProduct = new ProductModel ({
            title,
            description,
            code,
            img,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || [],
            owner
        });

        await newProduct.save();

        return newProduct;

    } catch (error) {
        console.log("Error adding product", error);
        throw error;
    }
    }

    async getProducts(limit = 10, page = 1, sort, query) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};

            if (query) {
                queryOptions = { category: query };
            }

            const sortOptions = {};
            if (sort) {
                if (sort === 'asc' || sort === 'desc') {
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error getting products", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id)

            if (!product){
                console.log("Didn't find the product");
                return null;
            }

            console.log("Product founded");
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
            return deleted;
        } catch (error) {
            console.log("Error deleting product", error);
            throw new Error("Error");
        }
    }
}

module.exports = ProductRepository;