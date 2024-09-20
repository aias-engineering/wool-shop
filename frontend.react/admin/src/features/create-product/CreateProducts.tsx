import styles from './CreateProducts.module.css'
import UploadAndCropImage from "../../components/UploadAndCropImage/UploadAndCropImage";

const CreateProducts = () => {


  return (
    <div>
      <h2>Create new Product</h2>
      <UploadAndCropImage></UploadAndCropImage>
    </div>);
}

export default CreateProducts