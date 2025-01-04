import './_image.css'
import clsx from 'clsx'
import NextImage from 'next/image'

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function Image({ src, alt, width, height, className }: Props) {
  return (
    <NextImage
      className={clsx('image', className)}
      src={src}
      width={width ?? 400}
      height={height ?? 640}
      alt={alt}
    />
  )
}
