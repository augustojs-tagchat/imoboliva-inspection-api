export function getFileName(text: string) {
  const filename = text.split('.')[0];

  return filename;
}
