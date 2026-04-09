import { evaluate as mathEvaluate } from 'mathjs'

export function evaluate(expression: string): number {
  if (!expression.trim()) throw new Error('Empty expression')
  const result = mathEvaluate(expression)
  if (result === Infinity || result === -Infinity) throw new Error('Division by zero')
  if (typeof result !== 'number' || isNaN(result)) throw new Error('Invalid result')
  return result
}

export function toUserMessage(e: unknown): string {
  if (e instanceof Error) {
    const msg = e.message.toLowerCase()
    if (msg.includes('unexpected end') || msg.includes('unexpected operator')) return 'Syntax error'
    if (msg.includes('division by zero') || msg.includes('infinity')) return 'Division by zero'
    if (msg.includes('empty')) return 'Enter an expression'
  }
  return 'Error'
}
