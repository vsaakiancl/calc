import type { ButtonConfig } from '../types/calculator'

export const BUTTON_CONFIG: ButtonConfig[] = [
  // Row 0: utility row
  { label: 'AC',  action: { type: 'CLEAR' },                              variant: 'utility' },
  { label: 'DEL', action: { type: 'BACKSPACE' },                          variant: 'utility' },
  { label: '(',   action: { type: 'APPEND_TOKEN', payload: '(' },         variant: 'paren'   },
  { label: ')',   action: { type: 'APPEND_TOKEN', payload: ')' },         variant: 'paren',   disabledWhen: 'noOpenParens' },
  // Row 1: 7 8 9 /
  { label: '7',   action: { type: 'APPEND_TOKEN', payload: '7' },         variant: 'digit'   },
  { label: '8',   action: { type: 'APPEND_TOKEN', payload: '8' },         variant: 'digit'   },
  { label: '9',   action: { type: 'APPEND_TOKEN', payload: '9' },         variant: 'digit'   },
  { label: '/',   action: { type: 'APPEND_TOKEN', payload: '/' },         variant: 'operator'},
  // Row 2: 4 5 6 *
  { label: '4',   action: { type: 'APPEND_TOKEN', payload: '4' },         variant: 'digit'   },
  { label: '5',   action: { type: 'APPEND_TOKEN', payload: '5' },         variant: 'digit'   },
  { label: '6',   action: { type: 'APPEND_TOKEN', payload: '6' },         variant: 'digit'   },
  { label: '*',   action: { type: 'APPEND_TOKEN', payload: '*' },         variant: 'operator'},
  // Row 3: 1 2 3 -
  { label: '1',   action: { type: 'APPEND_TOKEN', payload: '1' },         variant: 'digit'   },
  { label: '2',   action: { type: 'APPEND_TOKEN', payload: '2' },         variant: 'digit'   },
  { label: '3',   action: { type: 'APPEND_TOKEN', payload: '3' },         variant: 'digit'   },
  { label: '-',   action: { type: 'APPEND_TOKEN', payload: '-' },         variant: 'operator'},
  // Row 4: 0 . = +
  { label: '0',   action: { type: 'APPEND_TOKEN', payload: '0' },         variant: 'digit'   },
  { label: '.',   action: { type: 'APPEND_TOKEN', payload: '.' },         variant: 'digit'   },
  { label: '=',   action: { type: 'EQUALS' },                             variant: 'equals'  },
  { label: '+',   action: { type: 'APPEND_TOKEN', payload: '+' },         variant: 'operator'},
]
