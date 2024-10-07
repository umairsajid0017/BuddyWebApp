export default function kebabCase(str: string): string {
    return str
      .replace(/ /g, '-') 
      .replace(/([A-Z])/g, (match, p1) => `${p1.toLowerCase()}`)
      .replace(/^\-|\-$/g, '');
  }