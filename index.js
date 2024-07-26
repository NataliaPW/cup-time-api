import express from "express";
import { readFile } from "fs/promises";
import path from "path";
import cors from "cors";
import "express-async-errors"; // для автоматической обработки асинхронных ошибок
import { check, validationResult } from "express-validator";

const app = express();
const port = process.env.PORT || 3000; // использование переменной окружения для порта

let products = {};
app.use(cors());
// Middleware для обработки JSON данных
app.use(express.json());
app.use("/images", express.static("images"));

// Функция для чтения данных из файла db.json
const readProductsFromFile = async () => {
  const dbPath = path.resolve("db.json"); // path.resolve лучше для кросс-платформенной совместимости
  try {
    const data = await readFile(dbPath, "utf8");
    products = JSON.parse(data);
    console.log("Данные из файла db.json загружены");
  } catch (err) {
    console.error("Ошибка чтения файла db.json", err);
  }
};

// Вызываем функцию чтения данных при запуске сервера
readProductsFromFile();

// Функция для поиска товара по id
const findProductById = (id) => {
  for (const category in products) {
    const product = products[category].find((p) => p.id === parseInt(id));
    if (product) {
      return product;
    }
  }
  return null;
};

// Маршрут для получения всех товаров в одном массиве
app.get("/api/products", (req, res) => {
  const allProducts = Object.values(products).flat(); // Использование flat для "сплющивания" массива
  res.json(allProducts);
});

// Маршрут для получения одного товара по id
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const product = findProductById(id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Товар не найден" });
  }
});

// Маршрут для получения списка товаров по списку id в пути /api/product/list?ids=1,2,3,4
app.get("/api/products/list", (req, res) => {
  const { ids } = req.query;
  if (!ids) {
    res.status(400).json({ error: "Не указаны id товаров" });
    return;
  }
  const idArray = ids.split(",").map((id) => parseInt(id)); // Парсинг ID сразу в массив чисел
  const list = idArray
    .map((id) => findProductById(id))
    .filter((product) => product !== null);
  res.json(list);
});

// Маршрут для получения товаров по категориям
app.get("/api/products/:category", (req, res) => {
  const { category } = req.params;
  if (products[category]) {
    res.json(products[category]);
  } else {
    res.status(404).json({ error: "Категория не найдена" });
  }
});

// Маршрут для создания заказа
app.post(
  "/api/order",
  [
    check("name").notEmpty().withMessage("Имя обязательно"),
    check("phone").notEmpty().withMessage("Телефон обязателен"),
    check("address").notEmpty().withMessage("Адрес обязателен"),
    check("items").isArray().withMessage("Items должен быть массивом"),
  ],
  (req, res) => {
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
      const product = findProductById(item.id);
      return {
        ...product,
        quantity: item.quantity,
      };
    });

    // Здесь можно добавить логику для сохранения заказа в базу данных
    // или отправки уведомления

    res.status(201).json({
      message: "Заказ успешно создан",
      order: {
        name,
        phone,
        address,
        items: orderItems,
      },
    });
  },
);

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
