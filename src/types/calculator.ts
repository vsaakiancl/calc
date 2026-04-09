export type CalculatorState = {
  expression: string
  displayValue: string
  error: string | null
  openParenCount: number
}

export type Action =
  | { type: 'APPEND_TOKEN'; payload: string }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'BACKSPACE' }

export type ButtonVariant = 'digit' | 'operator' | 'utility' | 'paren' | 'equals'

export type ButtonConfig = {
  label: string
  action: Action
  variant: ButtonVariant
  disabledWhen?: 'noOpenParens'
}
