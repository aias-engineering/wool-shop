import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import UploadAndCropImage, { Image } from "../../components/UploadAndCropImage/UploadAndCropImage";
import { addImage } from './create-product.slice'
import { match } from 'ts-pattern';
import styles from './CreateProducts.module.css'
import Container from '../../components/atomics/container';
import HeaderLayout from '../../components/organisms/layout/header';
import Grid from '../../components/molecules/grid';
import GridItem from '../../components/molecules/grid/item';
import Title from '../../components/atomics/title';
import ImagesLayout, { ImagesLayoutShowCase } from '../../components/organisms/layout/images';

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
        <GridItem columnSpan={6}>
          <UploadAndCropImage maxImages={5} onImagesCroped={handleImagesCroped}></UploadAndCropImage>
        </GridItem>
        <GridItem columnSpan={6}>
          <Title as='h2'>
            Nederlands
          </Title>
        </GridItem>
      </Grid>
    </Container>);
}

export default CreateProducts