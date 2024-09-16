import { createSlice } from "@reduxjs/toolkit"

export interface ProductsState {
    status: 'loading'
}

const initialState: ProductsState = {
    status: 'loading'
}

export const productsSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {

    }
})

export const { } = productsSlice.actions

export default productsSlice.reducer