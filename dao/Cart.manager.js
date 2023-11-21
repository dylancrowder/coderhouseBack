import cartsModel from "./models/carts.models.js";
import productModel from "./models/products.model.js";

export default class CartsModel {
  static get() {
    return cartsModel.find();
  }

  static async getById(sid) {
    const cart = await cartsModel.findById(sid);
    if (!cart) {
      throw new Error("carrito no encontrado");
    }
    return cart;
  }

  static async create(data) {
    const cart = await cartsModel.create(data);
    console.log("carrito creado");
    return cart;
  }

  static async updateById(sid, data) {
    await cartsModel.updateOne({ _id: sid }, { $set: data });
    console.log("carrito actualizado correctamente");
  }

  static async deleteById(sid) {
    await cartsModel.deleteOne({ _id: sid });
    console.log("carrito eliminado correctamente");
  }

  static async addProductToCart(cartId, productId) {
    try {
      // Buscar el carrito por su ID
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      // Supongamos que tienes un modelo de productos llamado productsModel
      // y que cada producto tiene su propio ID
      const product = await productModel.findById(productId);

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      // Agregar el producto al carrito
      cart.products.push(product);

      // Guardar el carrito actualizado en la base de datos
      await cart.save();

      console.log("Producto agregado al carrito correctamente");
    } catch (error) {
      console.error(error.message);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
}
