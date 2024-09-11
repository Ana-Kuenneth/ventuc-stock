import { create } from 'zustand';

const useStore = create((set) => ({
  products: [],
  movements: [],
  sales: [],
  brands: [],
  categories: [],
  movement: [],
  productCodeCounter: 100001, // El código inicial si no hay productos

  // Set de productos completos
  // Al cargar productos desde el backend, setear el mayor código
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
      movements: [
        ...state.movements,
        {
          type: 'Compra',
          code: newProduct.code,
          name: newProduct.name,
          brand: newProduct.brand,
          category: newProduct.category,
          description: newProduct.description,
          date: newProduct.date,
          previousStock: 0,
          newStock: newProduct.stock,
          price: newProduct.price,
          buyer: newProduct.buyer,
          image: newProduct.image,
        },
      ],
      productCodeCounter: state.productCodeCounter + 1, // Incrementar el contador
    };
  }),

  // Actualizar un producto existente
  updateProduct: (updatedProduct) => set((state) => ({
    products: state.products.map((product) =>
      product.code === updatedProduct.code ? updatedProduct : product
    ),
    movements: [
      ...state.movements,
      {
        type: 'Actualización',
        code: updatedProduct.code,
        name: updatedProduct.name,
        brand: updatedProduct.brand,
        category: updatedProduct.category,
        description: updatedProduct.description,
        date: updatedProduct.date,
        previousStock: state.products.find(p => p.code === updatedProduct.code).stock,
        newStock: updatedProduct.stock,
        price: updatedProduct.price,
        buyer: updatedProduct.buyer,
        image: updatedProduct.image,
        description: 'Producto actualizado',
      }
    ],
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

  // Registrar una venta
  recordSale: (sale) => set((state) => {
    const updatedProducts = state.products.map((product) =>
      product.code === sale.code ? { ...product, stock: product.stock - sale.quantity } : product
    );
    const product = state.products.find((product) => product.code === sale.code);
    return {
      products: updatedProducts,
      sales: [...state.sales, sale],
      movements: [
        ...state.movements,
        {
          type: 'Venta',
          code: sale.code,
          name: product.name,
          brand: product.brand,
          category: product.category,
          date: new Date().toISOString().split('T')[0],
          previousStock: product.stock,
          newStock: product.stock - sale.quantity,
          description: 'Venta realizada',
        },
      ],
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
}));

export default useStore;
