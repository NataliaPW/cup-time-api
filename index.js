import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import path from "path";
import "express-async-errors";
import swaggerDocument from "./docs/swagger.json" assert { type: "json" };
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { readProductsFromFile } from "./utils/fileUtils.js";

const app = express();
const port = process.env.PORT || 3000;

let products = {};

app.use(cors());

// Middleware для обработки JSON данных
app.use(express.json());

// Middleware для документации API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware для обслуживания статических файлов
app.use("/images", express.static(path.resolve("/images")));

// Инициализация данных
readProductsFromFile()
  .then((data) => {
    products = data;
  })
  .catch((err) => {
    console.error("Ошибка инициализации данных", err);
  });

// Роуты
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

export { products };
