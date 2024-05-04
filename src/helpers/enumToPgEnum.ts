// Takes an enum and return an array with each values
export function enumToPgEnum(
  myEnum: Record<string, string>
): [string, ...string[]] {
  return Object.values(myEnum).map((value) => `${value}`) as [
    string,
    ...string[]
  ];
}
