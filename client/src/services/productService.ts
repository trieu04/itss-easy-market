import apiService from './api';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  originalPrice?: number;
  price: number;
  unit: string;
  image: string;
  discount?: number;
  rating: number;
  stock: number;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image?: string;
  rating?: number;
  stock: number;
  discount?: number;
}

class ProductService {
  async getProducts(): Promise<Product[]> {
    return apiService.get<Product[]>('/products');
  }

  async getProduct(id: string): Promise<Product> {
    return apiService.get<Product>(`/products/${id}`);
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    return apiService.post<Product>('/products', data);
  }

  async updateProduct(id: string, data: Partial<CreateProductRequest>): Promise<Product> {
    return apiService.patch<Product>(`/products/${id}`, data);
  }

  async deleteProduct(id: string): Promise<void> {
    await apiService.delete(`/products/${id}`);
  }
}

export const productService = new ProductService();
export default productService; 