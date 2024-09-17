import { useAppDispatch, useAppSelector } from "../../../lib/hooks.ts";
import { ProductStatus_Loaded, ProductStatus_Loading, fetchProductsAsync } from './productsSlice.ts'

export default function Products() {
    const dispatch = useAppDispatch()
    const state = useAppSelector(state => state.products)

    return (
        <div>{
            state.status instanceof ProductStatus_Loading
            ? 'Loading Products'
            : state.status instanceof ProductStatus_Loaded
            ? state.status.products.length === 0
                ? (<div>
                    <p>No Products found</p>
                    <button onClick={() => dispatch(fetchProductsAsync())}>Fetch</button>
                    </div>)
                : state.status.products.map(product => (<h1>{product.name}</h1>))
            : 'failed'
        }
    </div>)
}