export function validateRevision(item: IItem, revision: string): boolean {
  return revision === item.revision
}
