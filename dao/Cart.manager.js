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
        const newCart = await this.cartsModel.create(data);
        newCart.products.push({ product: productId, quantity: 1 });
        await newCart.save();

        console.log(
          "Producto agregado al carrito correctamente",
          newCart.products
        );
      } else {
        const existingProductIndex = cart.products.findIndex(
          (item) => item.product.toString() === productId.toString()
        );

        if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += 1;
        } else {
          cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();

        console.log(
          "Producto agregado al carrito correctamente",
          cart.products
        );
      }
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

  static async addProductQuantity(cartId, productId) {
    try {
      // Buscar el carrito por su ID y el producto específico
      const updatedCart = await this.updateCartQuantity(cartId, productId);

      // Calcular el total del carrito
      const total = this.calculateCartTotal(updatedCart);

      console.log("Total del carrito:", total);

      if (!updatedCart) {
        console.log("Carrito creado o actualizado con éxito:", updatedCart);
      } else {
        console.log("Producto agregado al carrito correctamente:", updatedCart);
      }

      return { cart: updatedCart, total };
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.message);
      throw error;
    }
  }

  static async updateCartQuantity(cartId, productId) {
    const updatedCart = await cartsModel.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );

    if (!updatedCart) {
      return await this.createNewCart(cartId, productId);
    }

    return updatedCart;
  }

  static async createNewCart(cartId, productId) {
    const newCart = await cartsModel.findByIdAndUpdate(
      cartId,
      {
        $push: {
          products: { product: productId, quantity: 1 }
        }
      },
      { new: true, upsert: true }
    );

    return newCart;
  }

  static calculateCartTotal(cart) {
    if (!cart) return 0;

    return cart.products.reduce((acc, product) => {
      return acc + product.quantity * product.product.price;
    }, 0);
  }

  static async deleteAll(sid) {
    try {
      const cart = await cartsModel.findById(sid).populate("products.product");
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Obtén la ID del carrito
      const cartId = cart._id;

      // Elimina todos los productos asociados al carrito por su ID
      await cartsModel.updateOne({ _id: cartId }, { $set: { products: [] } });

      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }
}
