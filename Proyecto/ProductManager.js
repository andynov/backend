const fs = require("fs").promises;

class ProductManager {
    static lastId = 0;
    
    constructor(path){
        this.products = [];
        this.path = path;
    }
    
    async addProduct(newObject) {
        let {title, description, price, thumbnail, code, stock} = newObject;

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

        await this.saveFile(this.products);
    }

    getProducts(){
        console.log(this.products);
    }

    async getProductById(id){
        try{
            const arrayProducts = await this.readFile();
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

    async readFile() {
        try {
            const resp = await fs.readFile(this.path, "utf-8");
            const arrayProducts = JSON.parse(resp);
            return arrayProducts;
        } catch (error) {
            console.log("Error al leer el archivo ", error)
        }
    }
    
    async saveFile(arrayProducts) {
            try {
                await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2))
            } catch (error){
                console.log("Error al guardar el archivo ", error)
            }
    }

    async updateProduct(id, productUpdated) {
        try{
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);
            if (index !== -1) {
                arrayProducts.splice(index, 1, productUpdated);
                await this.saveFile(arrayProducts);
            } else{
                console.log("No se encontró el producto");
            }
        } catch(error){
            console.log("Error al actualizar el producto", error);
        }
    }

    async deleteProduct(id){
        try{
            const arrayProducts = await this.readFile();
            const index = arrayProducts.findIndex(item => item.id === id);
            if (index !== -1) {
                arrayProducts.splice(index, 1);
                await this.saveFile(arrayProducts);
            } else{
                console.log("No se encontró el producto");
            }
        } catch(error){
            console.log("Error al borrar el producto", error);
        }
    }
}



// TESTING:

// Instanciamos la clase ProductManager:

const manager = new ProductManager("./products.json");

// Invocamos el método getProducts y nos devuelve array vacío:
manager.getProducts();

// Utilizamos addProduct para agregar un producto


const guitarra = {
    title: "guitarra",
    description: "Guitarra Epihpone 335",
    price: 700000,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 2
}

manager.addProduct(guitarra);

// Agregamos un producto con un código diferente, para ver si lo suma

const violin = {
    title: "violin",
    description: "Violin de estudio",
    price: 900000,
    thumbnail: "Sin imagen",
    code: "abc124",
    stock: 5
}

manager.addProduct(violin);

// Llamo al método getProducts() para que muestre los productos agregados

manager.getProducts()

// Llamo al método getProductsById() para retornar un objeto buscado por ID

async function testSearchById() {
        const searched = await manager.getProductById(2)
        console.log(searched)
}

testSearchById();


// Eliminamos un producto

async function testDelete(){
    await manager.deleteProduct(2);
}

testDelete();

// Actualizamos mediante updateProduct() un producto


const guitarraAcustica = {
    id: 1,
    title: "Guitarra Acustica",
    description: "Guitarra con cuerdas de metal",
    price: 900000,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 9
}

async function testUpdate() {
    await manager.updateProduct(1, guitarraAcustica);
}

testUpdate();