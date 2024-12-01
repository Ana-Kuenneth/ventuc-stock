import { create } from 'zustand';

const useStore = create((set) => ({
  products: [],
  historyMovements: [],
  sales: [],
  incomes: [],
  actualitation: [],
  brands: [],
  categories: [],
  productCodeCounter: 1,
  saleCodeCounter: 1,
  incomeCodeCounter: 1,
  actualitationCodeCounter: 1,
  historyCodeCounter: 1,

  // Formatear el código con la cantidad de ceros apropiada
  formatCode: (counter, prefix) => {
    const digits = Math.max(5, counter.toString().length); // Mínimo 5 dígitos
    return `${prefix}-${String(counter).padStart(digits, '0')}`;
  },

  // Set de productos completos
  setProducts: (products) => {
    const maxCode = products.reduce(
      (max, product) => Math.max(max, parseInt(product.productCode.split('-')[1], 10)),
      0
    );

    set({
      products,
      productCodeCounter: maxCode + 1,
    });
  },

  // Agregar un producto nuevo
  addProduct: (product) => set((state) => {
    const newProduct = {
      ...product,
      productCode: state.formatCode(state.productCodeCounter, 'PR'),
      code: state.formatCode(state.incomeCodeCounter, 'HI'),
    };

    const newIncome = {
      ...product,
      productCode: state.formatCode(state.productCodeCounter, 'PR'),
      code: state.formatCode(state.incomeCodeCounter, 'HI'),
      generalCode: state.formatCode(state.historyCodeCounter, 'HM'),
    };

    return {
      products: [...state.products, newProduct],
      incomes: [...state.incomes, newIncome],
      historyMovements: [...state.historyMovements, newIncome],
      productCodeCounter: state.productCodeCounter + 1,
      incomeCodeCounter: state.incomeCodeCounter + 1,
      historyCodeCounter: state.historyCodeCounter + 1,
    };
  }),

  // Actualizar un producto existente
  updateProduct: (updatedProduct) => set((state) => ({
    products: state.products.map((product) =>
      product.productCode === updatedProduct.productCode ? updatedProduct : product
    ),
  })),

  // Eliminar un producto
  deleteProduct: (productCode) => set((state) => ({
    products: state.products.filter((product) => product.productCode !== productCode),
  })),

  // Actualizar el stock de un producto
  updateStock: (productCode, quantity, movement) => set((state) => {
    const updatedProducts = state.products.map((product) =>
      product.productCode === productCode ? { ...product, stock: quantity } : product
    );

    const newUpdate = {
      ...movement,
      code: state.formatCode(state.actualitationCodeCounter, 'HA'),
      generalCode: state.formatCode(state.historyCodeCounter, 'HM'),
    };

    return {
      products: updatedProducts,
      actualitations: [...state.actualitations, newUpdate], // Añadir la nueva actualización
      historyMovements: [...state.historyMovements, newIncome],
      actualitationCodeCounter: state.actualitationCodeCounter + 1, // Incrementar el contador de actualizaciones
      historyCodeCounter: state.historyCodeCounter + 1,
    };
  }),


  // Ventas
  setSales: (sales) => {
    const maxCode = sales.reduce(
      (max, sale) => Math.max(max, parseInt(sale.generalCode.split('-')[1], 10)),
      0
    );

    set({
      sales,
      historyCodeCounter: maxCode + 1,
    });
  },

  // Registrar una venta
  recordSale: (sale) => set((state) => {
    const updatedProducts = state.products.map((product) =>
      product.productCode === sale.productCode ? { ...product, stock: product.stock - sale.quantity } : product
    );

    const newSale = {
      ...sale,
      code: state.formatCode(state.saleCodeCounter, 'HS'),
      generalCode: state.formatCode(state.historyCodeCounter, 'HM'),
    };

    return {
      products: updatedProducts,
      sales: [...state.sales, newSale],
      historyMovements: [...state.historyMovements, newSale],
      saleCodeCounter: state.saleCodeCounter + 1,
      historyCodeCounter: state.historyCodeCounter + 1,
    };
  }),

  // Marcas
  setBrands: (brands) => set({ brands }),

  addBrand: (brand) => set((state) => ({
    brands: [...state.brands, {
      ...brand,
      code: state.formatCode(state.brands.length + 1, 'BR'),
      name: brand.name.toUpperCase(),
      date: new Date().toISOString().split('T')[0],
    }],
  })),

  updateBrand: (brandCode, newName) => set((state) => ({
    brands: state.brands.map((brand) =>
      brand.code === brandCode ? { ...brand, name: newName.toUpperCase() } : brand
    ),
  })),

  removeBrand: (brandCode) => set((state) => ({
    brands: state.brands.filter((brand) => brand.code !== brandCode),
  })),

  // Categorías
  setCategories: (categories) => set({ categories }),

  addCategory: (category) => set((state) => ({
    categories: [...state.categories, {
      ...category,
      code: state.formatCode(state.categories.length + 1, 'CT'),
      name: category.name.toUpperCase(),
    }],
  })),

  updateCategory: (categoryCode, newName) => set((state) => ({
    categories: state.categories.map((category) =>
      category.code === categoryCode ? { ...category, name: newName.toUpperCase() } : category
    ),
  })),

  removeCategory: (categoryCode) => set((state) => ({
    categories: state.categories.filter((category) => category.code !== categoryCode),
  })),

  // Movimientos
  setMovements: (movements) => {
    const maxCode = movements.reduce(
      (max, movement) => Math.max(max, parseInt(movement.generalCode.split('-')[1], 10)),
      0
    );

    set({
      movements,
      historyCodeCounter: maxCode + 1,
      history: [...movements],
    });
  },

  // Registrar un movimiento
  registerMovement: (movementData) => set((state) => {
    const product = state.products.find((p) => p.productCode === movementData.productCode);
    if (!product) {
      throw new Error(`Producto con código ${movementData.productCode} no encontrado.`);
    }

    const newMovement = {
      generalCode: state.formatCode(state.historyCodeCounter, 'HM'),
      type: movementData.type,
      productCode: movementData.productCode,
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: movementData.description || 'Movimiento registrado',
      date: new Date().toISOString().split('T')[0],
      previousStock: product.stock,
      newStock: movementData.newStock,
      price: product.price,
      buyer: movementData.buyer || product.buyer,
    };

    return {
      movements: [...state.movements, newMovement],
      history: [...state.history, newMovement],
      historyCodeCounter: state.historyCodeCounter + 1,
    };
  }),

  deleteMovement: (movementCode) => set((state) => ({
    movements: state.movements.filter((movement) => movement.generalCode !== movementCode),
    history: state.history.filter((movement) => movement.generalCode !== movementCode),
  })),




//********************************************************************************* */
// import { create } from 'zustand';

// const useStore = create((set) => ({
//   products: [],
//   history: [], // Almacena tanto las ventas como los movimientos
//   movements: [],
//   sales: [],
//   brands: [],
//   categories: [],
//   productCodeCounter: "PR-00001", // El código inicial si no hay productos
//   saleCodeCounter: "HS-00001", // El código inicial si no hay ventas
//   incomeCodeCounter: "HI-00001", // El código inicial si no hay ingresos
//   actualizationCodeCounter: "HA-00001", // El código inicial si no hay actualizaciones
//   historyCodeCounter: "HM-000001", // Iniciar el contador de movimientos en 1

//   // Set de productos completos
//   setProducts: (products) => {
//     // const maxCode = products.reduce((max, product) => Math.max(max, parseInt(product.code)), 100000);
//     const maxCode = products.reduce(
//       (max, product) => Math.max(max, parseInt(product.code.split('-')[1], 10)),
//       100000
//     );

//     set({ 
//       products, 
//       productCodeCounter: maxCode + 1 // El código siguiente al mayor
//     });
//   },

//   // Agregar un producto nuevo
//   addProduct: (product) => set((state) => {
//     // const newProduct = { 
//     //   ...product, 
//     //   code: String(state.productCodeCounter) 
//     // };
//     const newProduct = {
//       ...product,
//       productCode: `PR-${String(state.productCodeCounter)}`,
//     };

//     return {
//       products: [...state.products, newProduct],
//       productCodeCounter: state.productCodeCounter + 1, // Incrementar el contador de productos
//     };
//   }),

//   // Actualizar un producto existente
//   updateProduct: (updatedProduct) => set((state) => ({
//     products: state.products.map((product) =>
//       product.code === updatedProduct.code ? updatedProduct : product
//     ),
//   })),

//   // Eliminar un producto
//   deleteProduct: (code) => set((state) => ({
//     products: state.products.filter((product) => product.code !== code),
//   })),

//   // Actualizar el stock de un producto
//   updateStock: (code, quantity) => set((state) => {
//     const updatedProducts = state.products.map((product) =>
//       product.code === code ? { ...product, stock: quantity } : product
//     );

//     return {
//       products: updatedProducts,
//     };
//   }),

//   // Ventas
//   setSales: (sales) => {
//     // const maxCode = sales.reduce((max, sale) => Math.max(max, parseInt(sale.generalCode)), 0);
//     const maxCode = sales.reduce(
//       (max, sale) => Math.max(max, parseInt(sale.generalCode.split('-')[1], 10)),
//       0
//     );

//     set({ 
//       sales, 
//       historyCodeCounter: maxCode + 1 // El código siguiente al mayor
//     });
//   },

//   // Registrar una venta
//   recordSale: (sale) => set((state) => {
//     const updatedProducts = state.products.map((product) =>
//       product.code === sale.code ? { ...product, stock: product.stock - sale.quantity } : product
//     );

//     // const newSale = {
//     //   ...sale,
//     //   generalCode: String(state.historyCodeCounter).padStart(5, '0') // Asignar el número de movimiento general
//     // };
//     const newSale = {
//       ...sale,
//       generalCode: `HM-${String(state.historyCodeCounter).padStart(5, '0')}`,
//     };

//     return {
//       products: updatedProducts,
//       sales: [...state.sales, newSale],
//       history: [...state.history, newSale], // Agregar la venta al historial
//       historyCodeCounter: state.historyCodeCounter + 1 // Incrementar el contador de movimientos
//     };
//   }),

//   // Marcas
//   setBrands: (brands) => set({ brands }),

//   addBrand: (brand) => set((state) => ({
//     brands: [...state.brands, { 
//       ...brand, 
      
//       // code: String(state.brands.length + 1).padStart(3, '0'),
//       code: `BR-${String(state.brands.length + 1).padStart(3, '0')}`,

//       name: brand.name.toUpperCase(),
//       date: new Date().toISOString().split('T')[0],
//     }],
//   })),

//   updateBrand: (code, newName) => set((state) => ({
//     brands: state.brands.map((brand) =>
//       brand.code === code ? { ...brand, name: newName.toUpperCase() } : brand
//     ),
//   })),

//   removeBrand: (code) => set((state) => ({
//     brands: state.brands.filter((brand) => brand.code !== code),
//   })),

//   // Categorías
//   setCategories: (categories) => set({ categories }),

//   addCategory: (category) => set((state) => ({
//     categories: [...state.categories, { 
//       ...category, 

//       // code: String(state.categories.length + 1).padStart(3, '0'), 
//       code: `CT-${String(state.categories.length + 1).padStart(3, '0')}`,

//       name: category.name.toUpperCase(),
//     }],
//   })),

//   updateCategory: (code, newName) => set((state) => ({
//     categories: state.categories.map((category) =>
//       category.code === code ? { ...category, name: newName.toUpperCase() } : category
//     ),
//   })),

//   removeCategory: (code) => set((state) => ({
//     categories: state.categories.filter((category) => category.code !== code),
//   })),

//   // Movimientos
//   setMovements: (movements) => {
//     // const maxCode = movements.reduce((max, movement) => Math.max(max, parseInt(movement.generalCode)), 0);
//     const maxCode = movements.reduce(
//       (max, movement) => Math.max(max, parseInt(movement.generalCode, 10)),
//       0
//     );

//     set({ 
//       movements, 
//       historyCodeCounter: maxCode + 1,
//       history: [...movements] // Inicializar el historial con los movimientos existentes
//     });
//   },

//   // Registrar un movimiento
//   registerMovement: (movementData) => set((state) => {
//     const product = state.products.find((p) => p.code === movementData.code);
//     if (!product) {
//       throw new Error(`Producto con código ${movementData.code} no encontrado.`);
//     }

//     const newMovement = {
//       // generalCode: String(state.historyCodeCounter).padStart(5, '0'), // Incrementar el contador
//       generalCode: `HM-${String(state.historyCodeCounter).padStart(5, '0')}`,

//       type: movementData.type, // "Actualización", "Venta", "Compra", etc.
//       code: movementData.code,
//       name: product.name,
//       brand: product.brand,
//       category: product.category,
//       description: movementData.description || 'Movimiento registrado',
//       date: new Date().toISOString().split('T')[0],
//       previousStock: product.stock,
//       newStock: movementData.newStock,
//       price: product.price,
//       buyer: movementData.buyer || product.buyer, // Asegurar que el comprador esté definido
//     };

//     return {
//       movements: [...state.movements, newMovement],
//       history: [...state.history, newMovement], // Agregar el movimiento al historial
//       historyCodeCounter: state.historyCodeCounter + 1 // Incrementar el contador de movimientos
//     };
//   }),

  // deleteMovement: (code) => set((state) => {
  //   const updatedMovements = state.movements.filter((movement) => movement.code !== code);
  //   const updatedHistory = state.history.filter((movement) => movement.code !== code);
    
  //   return {
  //     movements: updatedMovements,
  //     history: updatedHistory, // Actualizar el historial al eliminar un movimiento
  //   };
  // deleteMovement: (code) => set((state) => ({
  //   movements: state.movements.filter((movement) => movement.code !== code),
  //   history: state.history.filter((movement) => movement.code !== code),
  // })),
  

//***************************************************************************************************** */

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
