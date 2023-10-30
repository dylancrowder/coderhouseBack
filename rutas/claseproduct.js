const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./productos.json";
  }

  writeProducts = async (productos) => {
    try {
      await fs.writeFile(
        this.path,
        JSON.stringify(productos, null, 2),
        "utf-8"
      );
    } catch (error) {
      throw error;
    }
  };

  readProducts = async () => {
    try {
      const fileContents = await fs.readFile(this.path, "utf-8");
      return JSON.parse(fileContents);
    } catch (error) {
      throw error;
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    let newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };
    sdsdsd;
    this.products.push({
      ...newProduct,
      id: uuidv4()
    });

    await this.writeProducts(this.products);
  };
}
module.exports = { ProductManager };
