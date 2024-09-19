import { useState } from "react";
import { match } from "ts-pattern";
import './CreateProducts.css'
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { addImage } from './create-product.slice'


const UploadAndDisplayImages = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const lastAdded = () => selectedImages.at(0)
  const rest = () => selectedImages.slice(1)
  // Return the JSX for rendering
  return (
    <div>
        <h4>Upload and Display Image</h4>
        {selectedImages.length > 0
                  ? ( <div className="showcase-img">
                            <img className="image-row__img"
                                 alt="not found"
                                 src={URL.createObjectURL(lastAdded())} />
                        </div>)
                    : (<div></div>)}
            {selectedImages.length > 1
                    ? ( <div className="image-row" >
                        {rest().map((image, index) => (
                            <div>
                                <img key={index}
                                     className="image-row__img"
                                     alt="not found"
                                     src={URL.createObjectURL(image)} />
                            </div>
                        ))}
                        </div>)
                    : (<></>)}
        
          <input type="file" name="myImage"
               onChange={(event) => {
                    setSelectedImages([event.target.files[0], ...selectedImages]); // Update the state with the selected file
                    }}/>
      </div>
    );
  };

const CreateProducts = () => {
  const state = useAppSelector(state => state.createProducts)
  const dispatch = useAppDispatch();

  return (
    <div className="create-products-main">
      <h2>Create new Product</h2>
      <div className="product-creation">
        { match(state.flow)
          .with({step: 'idle'}, () => 
            ( <label className="img-placeholder">
                <div>Add Product Image</div>
                <div>+</div>
                <input className="img-placeholder__add-input" type="file" name="newImage" onChange={(event) => {dispatch(addImage(event.target.files[0]))}} />
              </label>))
          .with({step: 'img-added'}, ({images}) => 
            ( <div className="showcase-img">
                {images.map(image => 
                  (<img alt="not found" src={URL.createObjectURL(image)} />)
                )}
              </div>))
          .otherwise(() => (<></>))}
      </div>
    </div>);
}

export default CreateProducts