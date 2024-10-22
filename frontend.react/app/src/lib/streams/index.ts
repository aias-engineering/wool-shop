import stream, { Duplex, Readable } from "stream";
import streamWeb from "stream/web";

export function toReadableWeb(input: ReadableStream<Uint8Array>) {

  const readable = new stream.Readable();
  readable.wrap(Duplex.from(input))
  return readable
}

export function fromReadabaleWebToBodyInit(input: NodeJS.ReadableStream) {
  return toBodyInit(fromReadableWeb(input))
}

export function fromReadableWeb(input: NodeJS.ReadableStream): streamWeb.ReadableStream {
  return stream.Readable.toWeb(new Readable().wrap(input))
}

export function toBodyInit(input: streamWeb.ReadableStream) {
  return input as BodyInit
}