import { Product } from "./products.types";

export default interface ProductService {
    fetchProducts(): Promise<Product[]>
}

export class ProductServiceStub implements ProductService {
    
    products = []
    
    async fetchProducts(): Promise<Product[]> {
        return this.products
    }

}