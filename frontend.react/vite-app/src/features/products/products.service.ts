import { Product } from "./products.types";

export async function fetchProducts(): Promise<Product[]> {
    return new Promise<Product[]>(
        () => []
    );
}

export default { fetchProducts }