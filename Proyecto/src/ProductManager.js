const fs = require("fs").promises;

class ProductManager {
    static lastId = 0;
    
    constructor(path){
        this.arrayProducts = [];
        this.path = path;
    }
    
    async addProduct(newObject) {
        let {title, description, price, thumbnail, code, stock} = newObject;

        if(!title || !description || !price || !thumbnail || !code || !stock){
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
            price,
            thumbnail,
            code,
            stock
        }

        this.arrayProducts.push(newProduct);

        await this.saveProduct(this.arrayProducts);
    }

    getProducts(){
        console.log(this.arrayProducts);
    }

    async getProductById(id){
        try{
            const arrayProducts = await this.readProduct();
            const searched = arrayProducts.find(item => item.id === id);
            if (!searched) {
                console.log("No hemos encontrado el producto.")
            } else {
                console.log("Hemos encontrado el producto");
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

    async updateProduct(id, productUpdated) {
        try{
            const arrayProducts = await this.readProduct();
            const index = arrayProducts.findIndex(item => item.id === id);
            if (index !== -1) {
                arrayProducts.splice(index, 1, productUpdated);
                await this.saveProduct(arrayProducts);
            } else{
                console.log("No se encontró el producto");
            }
        } catch(error){
            console.log("Error al actualizar el producto", error);
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
                console.log("No se encontró el producto");
            }
        } catch(error){
            console.log("Error al borrar el producto", error);
        }
    }
}

module.exports = ProductManager;

