export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_CLIENT_URL}${path}`;
}
