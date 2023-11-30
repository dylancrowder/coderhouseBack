import cartsModel from "./models/carts.models.js";
import productModel from "./models/products.model.js";
import cartProductsModel from "./models/cartProducts.model.js";

export default class CartsModel {
  static async get() {
    return cartsModel.find();
  }

  static async getById(sid) {
    try {
      const cart = await cartsModel.findById(sid).populate("products.product");
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
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
      const cart = await cartsModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const product = await productModel.find({ _id: productId });
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      cart.products.push({ product: productId });
      await cart.save();

      console.log("Producto agregado al carrito correctamente", cart.products);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  static async deleteProductCart(cartId, productId) {
    try {
      const cart = await cartsModel.findById(cartId);
      console.log(cart);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      console.log(productIndex);

      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }

      cart.products.splice(productIndex, 1);

      await cart.save();

      console.log("Producto eliminado del carrito correctamente");
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  static async addProductQuantity(cartId, productId, data) {
    try {
      // Buscar el carrito por su ID
      const cart = await cartsModel
        .findById(cartId)
        .populate("products.product");

      console.log("ESTE ES EL CARRITO ", cart);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      /* como puedo leer el quantity de products */
      const primerProducto = cart.products[0];

      console.log("este es el producto", primerProducto);

      console.log("Producto agregado al carrito correctamente");
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}
