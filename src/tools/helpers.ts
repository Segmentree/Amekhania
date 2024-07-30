export function proxyUnwrap(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
