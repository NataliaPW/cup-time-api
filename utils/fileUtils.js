import { readFile } from "fs/promises";
import path from "path";

export const readProductsFromFile = async () => {
  const dbPath = path.resolve("db.json");
  try {
    const data = await readFile(dbPath, "utf8");
    console.log("Данные из файла db.json загружены");
    return JSON.parse(data);
  } catch (err) {
    console.error("Ошибка чтения файла db.json", err);
    throw err;
  }
};
