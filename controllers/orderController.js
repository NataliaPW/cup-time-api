import { validationResult } from "express-validator";
import { findProductById } from "../services/productService.js";
import { products } from "../app.js";

export const createOrder = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phone, address, items } = req.body;

  // Проверка, что все элементы в items имеют id и quantity
  for (const item of items) {
    if (!item.id || !item.quantity) {
      return res
        .status(400)
        .json({ error: "Каждый элемент в items должен иметь id и quantity" });
    }
  }

  // Дополнительно можно добавить проверку существования товаров по id
  const orderItems = items.map((item) => {
    const product = findProductById(item.id, products);
    return {
      ...product,
      quantity: item.quantity,
    };
  });

  // Здесь можно добавить логику для сохранения заказа в базу данных или отправки уведомления

  res.status(201).json({
    message: "Заказ успешно создан",
    order: {
      name,
      phone,
      address,
      items: orderItems,
    },
  });
};
