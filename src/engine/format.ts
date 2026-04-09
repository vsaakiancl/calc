export function formatResult(n: number): string {
  return parseFloat(n.toPrecision(12)).toString()
}
