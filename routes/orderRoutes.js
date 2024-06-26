import { Router } from "express";
import { check } from "express-validator";
import { createOrder } from "../controllers/orderController.js";

const router = Router();

router.post(
  "/",
  [
    check("name").notEmpty().withMessage("Имя обязательно"),
    check("phone").notEmpty().withMessage("Телефон обязателен"),
    check("address").notEmpty().withMessage("Адрес обязателен"),
    check("items").isArray().withMessage("Items должен быть массивом"),
  ],
  createOrder,
);

export default router;
