'use client'

import './_images-or-placeholder.css'
import { useState } from 'react'
import Image from 'next/image'
import { match, P } from 'ts-pattern'

interface Props {
  src: string | null,
  alt: string
}

export default function ImageOrPlaceholder({src, alt}: Props): JSX.Element {
  const [dynamicSrc, setDynamicSrc] = useState(src)

  async function handleError(): Promise<void> {
    await setDynamicSrc(null)
  }

  return (
    <>
      {match(dynamicSrc)
        .with(P.string, (s) => (
          <Image style={{ height: '100%' }}
                   src={s}
                   width={400}
                   height={640}
                   alt={alt}
                   onError={handleError} />))
          .otherwise(() => (
            <div className="image-or-placeholder__placeholder">
              Image not found
            </div>
          ))}
    </>
  )
}