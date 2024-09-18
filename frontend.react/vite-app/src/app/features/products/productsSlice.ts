import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ProductServiceStub } from "./products.service"
import { Product } from "./products.types"

const productService = new ProductServiceStub()
interface ProductsState {
    fetchState: 
        | { status: 'fetching' }
        | { status: 'fetched', products: Product[] }
}

const initialState: ProductsState = {
    fetchState: {status: 'fetched', products: [] }
 }

export const fetchProductsAsync = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        return await productService.fetchProducts()
    }
)

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {   
    },
    extraReducers: builder => {
        builder
        .addCase(fetchProductsAsync.pending, state => {
            state.fetchState = { status: 'fetching' }
        })
        .addCase(fetchProductsAsync.fulfilled, (state, action) => {
            state.fetchState = {status: 'fetched', products: action.payload }
        })
    }
})

export const {  } = productsSlice.actions

export default productsSlice.reducer