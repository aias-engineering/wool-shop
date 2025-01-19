import streamWeb from 'node:stream/web'
import stream from 'node:stream'

export function nodeWebStreamFromMdnStream(
  input: ReadableStream<Uint8Array>,
): streamWeb.ReadableStream {
  const streamReader = input.getReader()
  const pumpedStream = new streamWeb.ReadableStream<Uint8Array>({
    async start(controller: streamWeb.ReadableStreamController<Uint8Array>) {
      while (true) {
        const { done, value } = await streamReader.read()

        if (done) break

        controller.enqueue(value)
      }

      controller.close()
      streamReader.releaseLock()
    },
  })
  return pumpedStream
}

export function nodeReadable_From_MdnReadableStream(
  input: ReadableStream<Uint8Array>,
): stream.Readable {
  return stream.Readable.fromWeb(nodeWebStreamFromMdnStream(input))
}

export function mdnStreamFromNodeWebStream(
  input: streamWeb.ReadableStream,
): ReadableStream {
  const inputReader = input.getReader()

  const pumpedStream = new ReadableStream<Uint8Array>({
    async start(controller: ReadableStreamController<Uint8Array>) {
      while (true) {
        const { done, value } = await inputReader.read()

        if (done) break

        controller.enqueue(value)
      }

      controller.close()
      inputReader.releaseLock()
    },
  })

  return pumpedStream
}

export function mdnReadableStream_From_NodeReadableStream(
  input: NodeJS.ReadableStream,
): ReadableStream {
  return mdnStreamFromNodeWebStream(
    stream.Readable.toWeb(new stream.Readable().wrap(input)),
  )
}
