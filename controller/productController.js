const { Product, productValidation } = require("../models/Product.js");
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "cache/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

class productController {
  async addProduct(req, res) {
    try {
      const body = JSON.parse({ ...req.body }.content);
      const { error } = productValidation.validate(body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const { code } = body;
      const productExists = await Product.findOne({
        $or: [{ code }],
      });
      if (productExists) {
        return res.status(400).json({ message: "Product already exists" });
      }
      const images = await req.files.map(
        (el) => `http://localhost:8080/cache/images/${el.filename}`
      );
      const product = new Product({ ...body, images });
      await product.save();
      return res.status(200).json(product);
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send({ message: "Product not found!" });
      }
      return res.status(200).json(product);
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Product ID!" });
    }
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).send({ message: "Product not found!" });
      }
      return res.json(deletedProduct);
    } catch (e) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async editProduct(req, res) {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Product ID!" });
    }
    try {
      const isExists = await Product.findById(id);
      if (!isExists) {
        return res.status(400).send({ message: "Product not found" });
      }
      const { error } = productValidation.validate(req.body);
      if (error) {
        return res.status(400).send({ message: error.details });
      }
      const { title, type, description, price, rating, code, quantity, sale } =
        req.body;
      const editedProduct = await Product.findByIdAndUpdate(id, {
        title,
        type,
        description,
        price,
        rating,
        code,
        quantity,
        sale,
      }, {
        new: true
      });
      await editedProduct.save();
      return res.status(200).send(editedProduct);
    } catch (error) {
      res.status(400).send({ message: error });
    }
  }

  async getProducts(req, res) {
    try {
      const products = await Product.find();
      return res.status(200).send(products);
    } catch (e) {
      return res.status(400).send({ message: "Internal Server error" });
    }
  }
}

module.exports = {
  upload,
  controller: new productController(),
};
