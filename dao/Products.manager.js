import productModel from "./models/products.model.js";

export default class ProductManager2 {
  static get() {
    return productModel.find();
  }
  static async getById(sid) {
    const product = await productModel.findById(sid);
    if (!product) {
      throw new error("estudiante no econtrado");
    }
    return product;
  }
  static async create(data) {
    const product = await productModel.create(data);
    console.log("usuario creado");
    return product;
  }

  static async create(data) {
    const product = await productModel.create(data);
    console.log("usuario creado");
    return product;
  }

  static async updateById(sid, data) {
    await productModel.updateOne({ _id: sid }, { $set: data });
    console.log("usuario creado");
    console.log("actualizado correctamente ");
  }
  static async deleteById(sid, data) {
    await productModel.deleteOne({ _id: sid }, { $set: data });
    console.log("usuario creado");
    console.log("eliminado correctamente ");
  }
}
