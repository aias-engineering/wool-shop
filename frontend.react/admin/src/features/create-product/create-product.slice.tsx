import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { match } from "ts-pattern"

interface CreateProductState {
  images: {
    data: string[],
    flow: 
      | { step: 'empty' }
      | { step: 'crop', images: string[], imageName: string }
      | { step: 'added', images: string[], imageName: string }
  }
}

const initialState: CreateProductState = {
  images: { 
    data: [], 
    flow: { step: 'empty' } }
}

export const createProductSlice = createSlice({
  name: 'create-product',
  initialState,
  reducers: {
    showCropper: (state, action: PayloadAction<string>) => {
      match(state.images.flow)
        .with({step: 'empty'}, () => { state.images.flow = { step: 'crop', images: [], imageName: action.payload } })
        .with({step: 'added'}, ({images, imageName}) => { state.images.flow = { step: 'crop', images, imageName } })
    },
    addImage: (state) => {
      match(state.images.flow)
        .with({step: 'crop'}, ({images, imageName}) => { state.images.flow = { step: 'added', images: [...images, imageName], imageName } })
    }
  }
})

export const { addImage, showCropper } = createProductSlice.actions

export default createProductSlice.reducer