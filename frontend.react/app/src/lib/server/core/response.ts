export type ServerResponse = 
  | { statusCode: 200, body: ReadableStream | string, headers?: Record<string,string> }
  | { statusCode: 400 | 404, statusCodeText: string }