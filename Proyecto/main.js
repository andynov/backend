class ProductManager {
    static lastId = 0;
    
    constructor(){
        this.products = [];
    }
    
    addProduct(title, description, price, thumbnail, code, stock) {

        if(!title || !description || !price || !thumbnail || !code || !stock){
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
            thumbnail,
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

// TESTING:

// Instanciamos la clase Product Manager:

const manager = new ProductManager();

// Llamamos a getProducts y que devuelva un objeto vacío:

manager.getProducts();

// Llamamos al método addProduct()

manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
manager.getProducts();

// Repetición de código para chequear validación:

manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

// Validación de campos completados o no:

manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123");

// Validación de incrementación de ID:

manager.addProduct("producto prueba 2", "Este es un producto prueba 2", 200, "Sin imagen", "abc1234", 25);
manager.getProducts();

// Validación de getProductById

manager.getProductById(2);
manager.getProductById(5);

