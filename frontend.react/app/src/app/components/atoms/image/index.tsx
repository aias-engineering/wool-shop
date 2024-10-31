import './_image.css'
import clsx from 'clsx'
import NextImage from 'next/image'

interface Props {
  src: string,
  alt: string,
  className?: string
}

export default function Image({src, alt, className}: Props) {
  return (
    <NextImage className={clsx('image', className)} src={src} width={400} height={640} alt={alt} />
  )
}