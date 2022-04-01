const removeSpacesAndEspecialsCharacters = (string: string): string =>
  string
    .normalize(`NFD`)
    .replace(/[\u0300-\u036f]/g, ``)
    .toLocaleLowerCase()
    .trim()
    .replace(/[^\w\s]{1,}/gi, `-`)
    .replace(/[-]{1,}/g, ` `)
    .trim()
    .replace(/[ ]{1,}/g, `-`);

export default removeSpacesAndEspecialsCharacters;
