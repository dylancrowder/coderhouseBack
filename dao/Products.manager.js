import productModel from "./models/products.model.js";

export default class ProductManager2 {
  static async get(limit, page, sort, search) {
    const criteria = {};
    const options = { limit, page };
    if (sort) {
      options.sort = { price: sort };
    }
    if (search) {
      criteria.price = search;
    }
    const product = await productModel.paginate(criteria, options);
    return product;
  }
  static async getById(sid) {
    const product = await productModel.findById(sid);
    if (!product) {
      throw new error("producto no econtrado");
    }
    return product;
  }

  static async create(data) {
    const product = await productModel.create(data);
    console.log("producto creado");
    return product;
  }

  static async updateById(sid, data) {
    await productModel.updateOne({ _id: sid }, { $set: data });
    console.log("producto creado");
    console.log("actualizado correctamente ");
  }
  static async deleteById(sid) {
    await productModel.deleteOne({ _id: sid });
    console.log("usuario creado");
    console.log("eliminado correctamente ");
  }

 
}

export const responsePaginate = (data) => {
    return {
      status: "success",
      payload: data.docs.map((doc) => doc.toJSON()),
      totalPages: data.totalPages,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
      page: data.page,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevLink: data.hasPrevPage
        ? `http://localhost:8080/products?sort=${data.sort}&search=${data.search}&page=${data.prevPage}&limit=${data.limit}`
        : null,
      nextLink: data.hasNextPage
        ? `http://localhost:8080/products?sort=${data.sort}&search=${data.search}&page=${data.nextPage}&limit=${data.limit}`
        : null
    };
  };