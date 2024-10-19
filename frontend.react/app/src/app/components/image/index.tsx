import Image from "next/image"
import { match, P } from "ts-pattern"

interface Props {
  src: string | null,
  alt: string
}

const ImageOrPlaceholder = ({src, alt}: Props) => {

  return (
    <>
      {match(src)
        .with(P.string, (s) => (
          <>
            <Image style={{ height: '100%' }}
                   src={s}
                   width={480}
                   height={480}
                   alt={alt} />
          </>))
          .otherwise(() => (
            <>
              <div style={{ background: 'gray', height: '100%'}}>
              </div>
            </>
          ))}
    </>
  )
}

export default ImageOrPlaceholder