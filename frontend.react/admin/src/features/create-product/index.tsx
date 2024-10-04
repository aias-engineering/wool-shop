import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import UploadAndCropImage, { Image } from "../../components/UploadAndCropImage/UploadAndCropImage";
import { addImage } from './create-product.slice'
import Container from '../../components/atomics/container';
import HeaderLayout from '../../components/organisms/layout/header';
import Grid from '../../components/molecules/grid';
import GridItem from '../../components/molecules/grid/item';
import GridForm, { GridFormButton, GridFormInput, GridFormTitle } from '../../components/organisms/grid-form';

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
          <UploadAndCropImage maxImages={5} onImagesCroped={handleImagesCroped} />
        </GridItem>
        <GridItem columnSpan={6}>
          <GridForm>
            <GridFormTitle>product</GridFormTitle>
            <GridFormInput label='naam: ' id='name'/>
            <GridFormInput label='beschrijving: ' id='description' />
            <GridFormInput label='prijs: ' id='price' />
            <GridFormButton>creëren</GridFormButton>
          </GridForm>
        </GridItem>
      </Grid>
    </Container>);
}

export default CreateProducts