import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import UploadAndCropImage, { Image } from "../../components/UploadAndCropImage/UploadAndCropImage";
import { addImage } from './create-product.slice'
import { match } from 'ts-pattern';
import styles from './CreateProducts.module.css'
import Container from '../../components/atomics/container';
import HeaderLayout from '../../components/organisms/layout/header';
import Grid from '../../components/molecules/grid';
import GridItem from '../../components/molecules/grid/item';

const CreateProducts = () => {
  const state = useAppSelector(state => state.createProducts)
  const dispatch = useAppDispatch()

  function handleImagesCroped(images: Image[]): void {
    dispatch(addImage(images))
  }

  return (
    <Container>
      <HeaderLayout />
      <Grid>
        <GridItem columnSpan={6} padding='double'>
        <UploadAndCropImage onImagesCroped={handleImagesCroped}></UploadAndCropImage>
          {match(state.images.flow)
            .with({step: 'images-added'}, () => (
              <div className={styles.buttonList}>
                <button className={styles.nextButton}>Next</button>  
              </div>
            ))
            .otherwise(() => (<></>))}
        </GridItem>
        <GridItem columnSpan={6}>
        </GridItem>
      </Grid>
    </Container>);
}

export default CreateProducts