class ProductManager {
    static lastId = 0;
    
    constructor(){
        this.products = [];
    }
    
    addProduct(title, description, price, image, code, stock) {

        if(!title || !description || !price || !image || !code || !stock){
            console.log("Completa todos los campos, por favor.");
            return;
        }

        if(this.products.some(item => item.code === code)){
            console.log("El código se repite. Intenta generar otro código, por favor.");
            return;
        }

        const newProduct = {
            id: ++ProductManager.lastId,
            title,
            description,
            price,
            image,
            code,
            stock
        }

        this.products.push(newProduct);
    }

    getProducts(){
        console.log(this.products);
    }

    getProductById(id){
        const product = this.products.find(item => item.id === id);

        if (!product) {
            console.log("No hemos encontrado el producto.")
        } else {
            console.log("Hemos encontrado el producto: ", product);
        }
        return product;
    }
}

const manager = new ProductManager();

