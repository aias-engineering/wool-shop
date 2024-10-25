'use client'

import { deleteImage } from "@/app/admin/image/actions"
import Button from "../../button"
import ImageOrPlaceholder from "../../image"
import OverlayContainer, { Overlay } from "../../overlay-container"

interface Props {
  src: string
}

export function ImageItem({src}: Props) {
  const url = `/api/image/${src}`

  return (
  <>
    <OverlayContainer>
      <ImageOrPlaceholder src={url} alt="blob" />
      <Overlay>
        <Button onClick={async () => deleteImage(src)}>Delete</Button>
      </Overlay>
    </OverlayContainer>
  </>
  )
}

export default function Images() {
  return (
    <>
    </>
  )
}