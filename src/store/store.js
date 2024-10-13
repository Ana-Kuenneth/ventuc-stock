import { create } from 'zustand';

const useStore = create((set) => ({
  products: [],
  movements: [],
  sales: [],
  brands: [],
  categories: [],
  productCodeCounter: 100001, // El código inicial si no hay productos
  historyCodeCounter: 0o1, // Iniciar el contador de movimientos en 1

  // Set de productos completos
  setProducts: (products) => {
    const maxCode = products.reduce((max, product) => Math.max(max, parseInt(product.code)), 100000);
    set({ 
      products, 
      productCodeCounter: maxCode + 1 // El código siguiente al mayor
    });
  },

  // Agregar un producto nuevo
  addProduct: (product) => set((state) => {
    const newProduct = { 
      ...product, 
      code: String(state.productCodeCounter) 
    };
    return {
      products: [...state.products, newProduct],
      productCodeCounter: state.productCodeCounter + 1, // Incrementar el contador de productos
    };
  }),

  // Actualizar un producto existente
  updateProduct: (updatedProduct) => set((state) => ({
    products: state.products.map((product) =>
      product.code === updatedProduct.code ? updatedProduct : product
    ),
  })),

  // Eliminar un producto
  deleteProduct: (code) => set((state) => ({
    products: state.products.filter((product) => product.code !== code),
  })),

  // Actualizar el stock de un producto
  updateStock: (code, quantity) => set((state) => {
    const updatedProducts = state.products.map((product) =>
      product.code === code ? { ...product, stock: quantity } : product
    );
  
    return {
      products: updatedProducts,
    };
  }),

  // Ventas
  setSales: (sales) => set({ sales }),

  // Registrar una venta
  recordSale: (sale) => set((state) => {
    const updatedProducts = state.products.map((product) =>
      product.code === sale.code ? { ...product, stock: product.stock - sale.quantity } : product
    );
    
    const newSale = {
      ...sale,
      generalCode: state.historyCodeCounter // Asignar el número de movimiento general
    };

    return {
      products: updatedProducts,
      sales: [...state.sales, newSale],
      historyCodeCounter: state.historyCodeCounter + 1 // Incrementar el contador de movimientos
    };
  }),

  // Marcas
  setBrands: (brands) => set({ brands }),
  
  addBrand: (brand) => set((state) => ({
    brands: [...state.brands, { 
      ...brand, 
      code: String(state.brands.length + 1).padStart(3, '0'), 
      name: brand.name.toUpperCase(),
      date: new Date().toISOString().split('T')[0],
    }],
  })),
  
  updateBrand: (code, newName) => set((state) => ({
    brands: state.brands.map((brand) =>
      brand.code === code ? { ...brand, name: newName.toUpperCase() } : brand
    ),
  })),

  removeBrand: (code) => set((state) => ({
    brands: state.brands.filter((brand) => brand.code !== code),
  })),

  // Categorías
  setCategories: (categories) => set({ categories }),

  addCategory: (category) => set((state) => ({
    categories: [...state.categories, { 
      ...category, 
      code: String(state.categories.length + 1).padStart(3, '0'), 
      name: category.name.toUpperCase(),
    }],
  })),

  updateCategory: (code, newName) => set((state) => ({
    categories: state.categories.map((category) =>
      category.code === code ? { ...category, name: newName.toUpperCase() } : category
    ),
  })),

  removeCategory: (code) => set((state) => ({
    categories: state.categories.filter((category) => category.code !== code),
  })),

  // Movimientos
  setMovements: (movements) => set({ movements }),

  // Registrar un movimiento
  registerMovement: (movementData) => set((state) => {
    const product = state.products.find((p) => p.code === movementData.code);
    if (!product) {
      throw new Error(`Producto con código ${movementData.code} no encontrado.`);
    }

    const newMovement = {
      generalCode: state.historyCodeCounter, // Asignar número de movimiento general
      type: movementData.type, // "Actualización", "Venta", "Compra", etc.
      code: movementData.code,
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: movementData.description || 'Movimiento registrado',
      date: new Date().toISOString().split('T')[0],
      previousStock: product.stock,
      newStock: movementData.newStock,
      price: product.price,
      buyer: product.buyer,
    };

    return {
      movements: [...state.movements, newMovement],
      historyCodeCounter: state.historyCodeCounter + 1 // Incrementar el contador de movimientos
    };
  }),

  deleteMovement: (code) => set((state) => ({
    movements: state.movements.filter((movement) => movement.code !== code),
  })),




  // Movimientos de venta
  // setSaleMovements: (saleMovements) => set({ saleMovements }),

  // Registrar un movimiento
  // registerSaleMovement: (saleMovementData) => set((state) => {
  //   const sale = state.sales.find((p) => p.code === saleMovementData.productCode);
  //   if (!sale) {
  //     throw new Error(`Venta con código ${saleMovementData.code} no encontrada.`);
  //   }

  //   const newSaleMovement = {
  //     type: saleMovementData.type, // "Actualización", "Venta", "Compra", etc.
  //     code: saleMovementData.code,
  //     productCode: saleMovementData.productCode,
  //     name: saleMovementData.name,
  //     date: new Date().toISOString().split('T')[0],
  //     brand: sale.brand,
  //     client: sale.client,
  //     previousStock: sale.stock,
  //     newStock: saleMovementData.newStock,
  //     productPrice: saleMovementData.productPrice,
  //     incremento: saleMovementData.incremento,
  //     descIncremento: saleMovementData.descIncremento || 'Sin recargo adicional',
  //     total: saleMovementData.total,
  //     payMethod: saleMovementData.payMethod,
  //   };

  //   return {
  //     salesMovements: [...state.salesMovements, newSaleMovement],
  //   };
  // }),

  // deleteSaleMovement: (code) => set((state) => ({
  //   salesMovements: state.salesMovements.filter((saleMovement) => saleMovement.code !== code),
  // })),
}));

export default useStore;
