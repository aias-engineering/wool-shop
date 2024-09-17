import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import productsSlice from "../app/features/products/productsSlice";

const store = configureStore({
    reducer: {
        products: productsSlice
    }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>

export default store