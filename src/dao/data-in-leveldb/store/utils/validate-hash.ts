export function validateRevision(item: IItem, rev: string): boolean {
  return rev === item.rev
}
