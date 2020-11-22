export function validateHash(item: IItem, hash: string): boolean {
  return hash === item.meta.hash
}
