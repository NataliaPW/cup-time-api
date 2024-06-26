import { findProductById, getAllProducts } from "../services/productService.js";
import { products } from "../app.js";

export const getProducts = (req, res) => {
  const allProducts = getAllProducts(products);
  res.json(allProducts);
};

export const getProductsByCategory = (req, res) => {
  const { category } = req.params;
  if (products[category]) {
    res.json(products[category]);
  } else {
    res.status(404).json({ error: "Категория не найдена" });
  }
};

export const getProductById = (req, res) => {
  const { id } = req.params;
  const product = findProductById(id, products);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Товар не найден" });
  }
};

export const getProductsByIds = (req, res) => {
  const { ids } = req.query;
  if (!ids) {
    res.status(400).json({ error: "Не указаны id товаров" });
    return;
  }
  const idArray = ids.split(",").map((id) => parseInt(id));
  const list = idArray
    .map((id) => findProductById(id, products))
    .filter((product) => product !== null);
  res.json(list);
};
