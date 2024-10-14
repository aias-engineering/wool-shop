import UploadAndCropImage, { Image } from "@/app/components/upload-and-crop-image"

const Page = () => (
  <>
    <div style={{display: 'grid', gridTemplateColumns: '45dvw 45dvw'}}>
      <div style={{gridColumn: 1}}>
        <UploadAndCropImage />
      </div>
      <div style={{gridColumn: 1}}></div>
    </div>
  </>
)

export default Page