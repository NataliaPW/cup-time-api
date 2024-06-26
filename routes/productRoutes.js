import { Router } from "express";
import {
  getProducts,
  getProductsByCategory,
  getProductById,
  getProductsByIds,
} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/:category", getProductsByCategory);
router.get("/id/:id", getProductById);
router.get("/list", getProductsByIds);

export default router;
