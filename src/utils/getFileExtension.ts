export function getFileExtension(text: string) {
  const ext = text.split('.').pop();

  return ext;
}
