'use client'

import "./_image.css"
import Image from "next/image"
import { useState } from "react"
import { match, P } from "ts-pattern"

interface Props {
  src: string | null,
  alt: string
}

const ImageOrPlaceholder = ({src, alt}: Props) => {
  const [dynamicSrc, setDynamicSrc] = useState(src)  

  function handleError(): void {
    console.log('error')
    setDynamicSrc(null)
  }

  return (
    <>
      {match(dynamicSrc)
        .with(P.string, (s) => (
          <>
            <Image style={{ height: '100%' }}
                   src={s}
                   width={400}
                   height={640}
                   alt={alt}
                   onError={handleError} />
          </>))
          .otherwise(() => (
            <>
              <div className="image-or-placeholder__placeholder">
                Image not found
              </div>
            </>
          ))}
    </>
  )
}

export default ImageOrPlaceholder