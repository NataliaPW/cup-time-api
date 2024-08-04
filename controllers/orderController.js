import { validationResult } from "express-validator";
import { findProductById } from "../services/productService.js";
import { products } from "../index.js";

// Функция для генерации уникального ID
const generateOrderId = () => {
  let id;
  do {
    // Генерация случайного числа от 10000 до 99999
    id = Math.floor(Math.random() * 90000) + 10000;
  } while (idExists(id)); // Проверка уникальности

  return id;
};

// Пример функции проверки существования ID
// В реальном приложении вы бы проверяли это в базе данных
const idExists = (id) => {
  // Для демонстрации здесь нет реальной проверки
  // Необходимо заменить на логику проверки в базе данных
  return false;
};

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

  // Генерация уникального ID заказа
  const orderId = generateOrderId();

  // Здесь можно добавить логику для сохранения заказа в базу данных или отправки уведомления

  res.status(201).json({
    message: "Заказ успешно создан",
    order: {
      id: orderId,
      name,
      phone,
      address,
      items: orderItems,
    },
  });
};
