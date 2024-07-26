import { Router } from "express";
import {
  getProducts,
  getProductsByCategory,
  getProductById,
  getProductsByIds,
} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);

router.get("/id/:id", getProductById);
router.get("/list", getProductsByIds);
router.get("/:category", getProductsByCategory);

export default router;
