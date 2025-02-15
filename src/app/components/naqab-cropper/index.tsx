'use client'

import { useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import './_naqab-cropper.css'

interface Props {
  imageUrl: string
  onCropComplete: (cropAreaPixels: Area) => Promise<void>
}

const NaqabCropper = ({ imageUrl, onCropComplete }: Props) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<number>(1)

  return (
    <div className={'naqab-cropper'}>
      <Cropper
        image={imageUrl}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onCropComplete={async (_, croppedAreaPixels) => {
          await onCropComplete(croppedAreaPixels)
        }}
        onZoomChange={setZoom}
      />
    </div>
  )
}

export default NaqabCropper
