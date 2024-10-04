import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Image } from "../../components/UploadAndCropImage/UploadAndCropImage"

interface CreateProductState {
  images: {
    flow: 
    | { step: 'idle' }
    | { step: 'images-added', images: Image[] }
  }
}

const initialState: CreateProductState = {
  images: { flow: {step: 'idle' } }
}

export const createProductSlice = createSlice({
  name: 'create-product',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<Image[]>) => {
      state.images.flow = { step: 'images-added', images: action.payload }
    }
  }
})

export const { addImage } = createProductSlice.actions

export default createProductSlice.reducer