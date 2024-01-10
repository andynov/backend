const fs = require("fs").promises;

class CartManager {
    
    constructor(path){
        this.arrayCarts = [];
        this.path = path;
        this.lastId = 0;

        this.takeCarts();
    }

    async takeCarts(){
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.arrayCarts = JSON.parse(data);
            if (this.arrayCarts.length > 0) {
                this.lastId = Math.max(...this.arrayCarts.map(cart => cart.id));
            }
        } catch (error){
            console.error("Error taking the charts from file")
            await this.saveCarts();
        }
    }

    async saveCarts(arrayCarts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.arrayCarts, null, 2))
        } catch (error){
            console.log("Error saving the file ", error)
        }
}
    
    async addCart() {

        const newCart = {
            id: ++this.lastId,
            products: []
        }

        this.arrayCarts.push(newCart);

        await this.saveCarts();
        return newCart;
    }

    async getCartById(cartId){
        try{
            const cart = this.arrayCarts.find (e => e.id === cartId);
            if (!cart) {
                throw new Error(`The Cart ID ${cartId} doesn't exist.`);
            }
            return cart;

        } catch(error) {
            console.log("Error getting Cart by ID ", error)
        }
    }

    async addProductToCart(cartId, productId, quantity = 1){
        const cart = await this.getCartById(cartId);
        const productExist = cart.products.find(p => p.product === productId);

        if (productExist){
            productExist.quantity +=quantity;
        } else {
            cart.products.push({product: productId, quantity});
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;
