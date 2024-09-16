import { useState } from "react"
import { Product } from "./products.types"
import { fetchProducts } from './products.service.ts';

export default function Products() {
    const [status, setStatus] = useState<string>('loaded')
    const [products, setProducts] = useState<Product[]>([])

    const loadProducts = async () => {
        await setStatus('loading')
        const fetchedProducts = await fetchProducts()
        await setProducts(fetchedProducts)
        await setStatus('loaded')
    }

    return (
        <>
            <div>
                {status === 'loading' 
                    ? 'Loading Products'
                    : products.length === 0 
                        ? ( <div>
                                <p>No Products found</p>
                                <button onClick={loadProducts}>Load</button>
                            </div>)
                        : products.map(product => 
                                (<h1>{product.name}</h1>)
                            )}
            </div>
        </>)
}