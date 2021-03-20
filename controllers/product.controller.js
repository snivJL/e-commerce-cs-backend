const Product = require("../models/Product");
const utilsHelper = require("../helpers/utils.helper");

const { validationResult, check } = require("express-validator");
const validator = require("../middlewares/validation");

let productController = {};

productController.getAllProducts = async (req, res, next) => {
  try {
    let { page, limit, sortBy, search, ...filter } = req.query;
    const keywords = search ? { name: { $regex: search, $options: "i" } } : {};
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalProducts = await Product.countDocuments({
      ...filter,
      ...keywords,
      isDeleted: false,
    });
    console.log("totalproducts", totalProducts);

    const totalPages = Math.ceil(totalProducts / limit);
    console.log("totalpages", totalPages);

    const offset = limit * (page - 1);
    console.log("offset", offset);

    const products = await Product.find({ isDeleted: false, ...keywords })
      .skip(offset)
      .limit(limit);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products, page, totalPages },
      null,
      "List of products"
    );
  } catch (error) {
    next(error);
  }
};

productController.getSingleProduct = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) return next(new Error("401 - Product not found"));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Product detail found"
    );
  } catch (error) {
    next(error);
  }
};
productController.createProduct = async (req, res, next) => {
  console.log("CONTROLLER", req.body);
  try {
    const { name, description, price, images } = req.body;
    const product = await Product.create({ name, description, price, images });

    utilsHelper.sendResponse(res, 200, true, product, null, "Product created");
  } catch (error) {
    next(error);
  }
};

productController.updateProduct = async (req, res, next) => {
  const { name, description, price, images } = req.body;
  const productId = req.params.id;
  let fields = {};

  if (name) fields.name = name;
  if (description) fields.description = description;
  if (price) fields.price = price;
  if (images) fields.images = images;
  try {
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { $set: fields },
      { new: true }
    );
    if (!product) {
      return next(new Error("Product not found"));
    }
    utilsHelper.sendResponse(res, 200, true, product, null, "Product updated");
  } catch (error) {
    next(error);
  }
};

productController.deleteProduct = async (req, res, next) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isDeleted: true }
    );
    if (!product) {
      return next(new Error("Product not found"));
    }
    utilsHelper.sendResponse(res, 200, true, product, null, "Product deleted");
  } catch (error) {
    next(error);
  }
};

productController.getDeletedProducts = async (req, res, next) => {
  try {
    let { page, limit, sortBy, search, ...filter } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalProducts = await Product.countDocuments({
      ...filter,
      isDeleted: true,
    });
    console.log("totalproducts", totalProducts);

    const totalPages = Math.ceil(totalProducts / limit);
    console.log("totalpages", totalPages);

    const offset = limit * (page - 1);
    console.log("offset", offset);

    const products = await Product.find({ isDeleted: true })
      .skip(offset)
      .limit(limit);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products },
      null,
      "List of deleted products"
    );
  } catch (error) {
    next(error);
  }
};

productController.restoreProduct = async (req, res, next) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { isDeleted: false }
    );
    if (!product) {
      return next(new Error("Product not found"));
    }
    utilsHelper.sendResponse(res, 200, true, product, null, "Product restored");
  } catch (error) {
    next(error);
  }
};

module.exports = productController;
