import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { match } from "ts-pattern"

interface CreateProductState {
  flow: 
    | { step: 'idle' }
    | { step: 'img-added', images: File[] } 
}

const initialState: CreateProductState = {
  flow: { step: 'idle' }
}

export const createProductSlice = createSlice({
  name: 'create-product',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<File>) => {
      match(state.flow)
        .with({step: 'idle'}, () => { state.flow = { step: 'img-added', images: [ action.payload ] } })
        .with({step: 'img-added'}, ({images}) => { images = [...images, action.payload] })
    }
  }
})

export const { addImage } = createProductSlice.actions

export default createProductSlice.reducer