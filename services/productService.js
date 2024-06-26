export const findProductById = (id, products) => {
  for (const category in products) {
    const product = products[category].find((p) => p.id === parseInt(id));
    if (product) {
      return product;
    }
  }
  return null;
};

export const getAllProducts = (products) => {
  return Object.values(products).flat();
};
