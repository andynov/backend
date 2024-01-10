const fs = require("fs").promises;

class ProductManager {
    static lastId = 0;
    
    constructor(path){
        this.arrayProducts = [];
        this.path = path;

        this.getProducts();
    }



    async addProduct(newObject) {
        const {title, description, price, thumbnail, code, stock, category} = newObject;

        if(!title || !description || !price || !code || !stock || !category){
            console.log("Completa todos los campos, por favor.");
            return;
        }

        if(this.arrayProducts.some(item => item.code === code)){
            console.log("El código se repite. Intenta generar otro código, por favor.");
            return;
        }

        const newProduct = {
            id: ++ProductManager.lastId,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnail,
        }

        this.arrayProducts.push(newProduct);

        await this.saveProduct(this.arrayProducts);

        return newProduct;
    }

    async getProducts(){
        try{
            const arrayProducts = await this.readProduct();
            return arrayProducts;
        }
        catch (error){
            console.log("Error reading file", error);
        }
    }

    async getProductById(id){
        try{
            const arrayProducts = await this.readProduct();
            const searched = arrayProducts.find(item => item.id === id);
            if (!searched) {
                console.log("Don't find the product")
            } else {
                console.log("we find the product");
                return searched;
            }

        } catch(error) {
            console.log("Error al leer el archivo ", error)
        }
    }

    async readProduct() {
        try {
            const resp = await fs.readFile(this.path, "utf-8");
            const arrayProducts = JSON.parse(resp);
            return arrayProducts;
        } catch (error) {
            console.log("Error al leer el archivo ", error)
        }
    }
    
    async saveProduct(arrayProducts) {
            try {
                await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2))
            } catch (error){
                console.log("Error al guardar el archivo ", error)
            }
    }

    async updateProduct(id, productUpdatedData) {
        try{
            const arrayProducts = await this.readProduct();
            const index = arrayProducts.findIndex(item => item.id === id);
            if (index !== -1) {
                const existingProduct = arrayProducts[index];
                
                const productUpdated = {
                    ...existingProduct,
                    ...productUpdatedData,
                    id: existingProduct.id};

                arrayProducts.splice(index, 1, productUpdated);
                await this.saveProduct(arrayProducts);
                return productUpdated;
                
            } else{
                console.log("Don't find the product");
            }
        } catch(error){
            console.log("Error updating the product", error);
        }
    }

    async deleteProduct(id){
        try{
            const arrayProducts = await this.readProduct();
            const index = arrayProducts.findIndex(item => item.id === id);
            if (index !== -1) {
                arrayProducts.splice(index, 1);
                await this.saveProduct(arrayProducts);
            } else{
                console.log("Don't find the product");
            }
        } catch(error){
            console.log("Error deletting the product", error);
        }
    }
}

module.exports = ProductManager;

