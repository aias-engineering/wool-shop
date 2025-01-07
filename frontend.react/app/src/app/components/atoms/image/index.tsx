import clsx from 'clsx'
import NextImage from 'next/image'

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  className?: string
}

export default function Image({ src, alt, width, height, fill, sizes, className }: Props) {
  return (
    <NextImage
      className={clsx('image', className)}
      height={height}
      width={width}
      src={src}
      fill={fill}
      sizes={sizes}
      alt={alt}
      
    />
  )
}
