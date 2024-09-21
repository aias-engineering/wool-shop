import styles from './CreateProducts.module.css'
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import UploadAndCropImage, { Image } from "../../components/UploadAndCropImage/UploadAndCropImage";
import { addImage } from './create-product.slice'
import { match } from 'ts-pattern';

const CreateProducts = () => {
  const state = useAppSelector(state => state.createProducts)
  const dispatch = useAppDispatch()

  function handleImagesCroped(images: Image[]): void {
    dispatch(addImage(images))
  }

  return (
    <div>
      <h2>Create new Product</h2>
      <UploadAndCropImage onImagesCroped={handleImagesCroped}></UploadAndCropImage>
      {match(state.images.flow)
        .with({step: 'images-added'}, () => (
          <div className={styles.buttonList}>
            <button className={styles.nextButton}>Next</button>  
          </div>
        ))
        .otherwise(() => (<></>))}
    </div>);
}

export default CreateProducts