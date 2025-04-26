export default function kebabCase(str: string): string {
  return str
    .replace(/ /g, '-') 
    .replace(/([A-Z])/g, (match: string, p1: string) => `${p1.toLowerCase()}`) 
    .replace(/^\-|\-$/g, ''); 
}

type NameParts = {
  firstName: string;
  lastName: string;
};

export function splitFullName(fullName: string): NameParts {
  const nameParts = fullName.trim().split(/\s+/);
  const lastName = nameParts.pop() ?? ""; 
  const firstName = nameParts.join(" ") ?? ""; 

  return {
    firstName,
    lastName,
  };
}
