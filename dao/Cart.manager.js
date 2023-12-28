import cartsModel from "./models/carts.models.js";
import productModel from "./models/products.model.js";
import cartProductsModel from "./models/cartProducts.model.js";
import userRegisterModel from "./models/userRegister.model.js";
export default class CartsModel {
  static get() {
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

  static async addToCart(userId, productId) {
    try {
      // Busca el usuario por su ID
      const user = await userRegisterModel.findById(userId);

      // Busca el carrito del usuario
      let cart = await cartsModel.findOne({ user: user._id });

      // Si el usuario no tiene un carrito, crea uno nuevo
      if (!cart) {
        cart = await cartsModel.create({ user: user._id, products: [] });
      }

      // Busca el producto por su ID
      const product = await productModel.findById(productId);

      // Agrega el producto al carrito
      cart.products.push({ product: product._id, quantity: 1 });

      // Guarda el carrito
      await cart.save();

      return {
        success: true,
        message: "Producto agregado al carrito con éxito."
      };
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      return { success: false, error: "Error interno del servidor." };
    }
  }

  static async create(userId, data) {
    try {
      // Crea el carrito
      const cart = await cartsModel.create(data);
      console.log("Carrito creado");

      // Asigna el carrito al usuario
      await userRegisterModel.findByIdAndUpdate(
        userId,
        { cart: cart._id },
        { new: true }
      );

      console.log("Carrito asignado al usuario");

      return cart;
    } catch (error) {
      console.error("Error al crear el carrito", error);
      throw error;
    }
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

  static async addProductQuantity(cartId, productId, body) {
    try {
      // Buscar el carrito por su ID y el producto específico
      const updatedCart = await this.updateCartQuantity(
        cartId,
        productId,
        body
      );

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

  static async updateCartQuantity(cartId, productId, body) {
    const updatedCart = await cartsModel.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $inc: { "products.$.quantity": body } },
      { new: true }
    );

    if (!updatedCart) {
      return await this.createNewCart(cartId, productId, cantidad);
    }

    return updatedCart;
  }

  static async createNewCart(cartId, productId, body) {
    const newCart = await cartsModel.findByIdAndUpdate(
      cartId,
      {
        $push: {
          products: { product: productId, quantity: body }
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
