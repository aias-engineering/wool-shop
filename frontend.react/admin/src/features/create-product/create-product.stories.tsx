import { Provider } from 'react-redux'
import CreateProducts from '.'
import { configureStore } from '@reduxjs/toolkit'
import createProductSlice from './create-product.slice'

export default {
  title: 'templates/create-product',
  component: CreateProducts
}
const store = configureStore({
  reducer: {
    createProducts: createProductSlice
  }
})

export const CreatingANewOne = () => (
  <Provider store={store}>
    <CreateProducts />
  </Provider>
)