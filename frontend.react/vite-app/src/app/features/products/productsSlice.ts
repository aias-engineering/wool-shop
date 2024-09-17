import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit"
import { Product } from "./products.types"
import { fetchProducts } from "./products.service"

export interface ProductsState {
    status: ProductsStatus
}

export abstract class ProductsStatus {}
export class ProductStatus_Loading extends ProductsStatus {}
export class ProductStatus_Loaded extends ProductsStatus {
    constructor(public products: Product[]) { 
        super()
    }
}
export class ProductsStatus_LoadFailed extends ProductsStatus {
    constructor(public error: SerializedError){
        super()
    }
}

const initialState: ProductsState = {
    status: new ProductStatus_Loaded([])
}

export const fetchProductsAsync = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        return await fetchProducts()
    }
)

export const productsSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {   
    },
    extraReducers: builder => {
        builder
        .addCase(fetchProductsAsync.pending, state => {
            state.status = new ProductStatus_Loading()
        })
        .addCase(fetchProductsAsync.fulfilled, (state, action) => {
            state.status = new ProductStatus_Loaded(action.payload)
        })
        .addCase(fetchProductsAsync.rejected, (state, action) => {
            state.status = new ProductsStatus_LoadFailed(action.error)
        })
    }
})

export const {  } = productsSlice.actions

export default productsSlice.reducer