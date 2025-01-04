export default function stringStream(string, _encoding: BufferEncoding = 'utf8') {
  return new Response(new Blob([string], { type: 'application/text' }));
}
