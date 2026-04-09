import { useReducer } from 'react'
import type { CalculatorState, Action } from '../types/calculator'
import { evaluate, toUserMessage } from '../engine/evaluate'
import { formatResult } from '../engine/format'

const initialState: CalculatorState = {
  expression: '',
  displayValue: '',
  error: null,
  openParenCount: 0,
}

const MAX_EXPRESSION_LENGTH = 200

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'CLEAR':
      return { ...initialState }

    case 'BACKSPACE': {
      const lastChar = state.expression.slice(-1)
      const parenDelta = lastChar === '(' ? -1 : lastChar === ')' ? 1 : 0
      return {
        ...state,
        expression: state.expression.slice(0, -1),
        error: null,
        openParenCount: state.openParenCount + parenDelta,
      }
    }

    case 'APPEND_TOKEN': {
      if (state.expression.length >= MAX_EXPRESSION_LENGTH) return state
      const parenDelta = action.payload === '(' ? 1 : action.payload === ')' ? -1 : 0
      return {
        ...state,
        expression: state.expression + action.payload,
        error: null,
        openParenCount: state.openParenCount + parenDelta,
      }
    }

    case 'EQUALS': {
      try {
        const result = evaluate(state.expression)
        return { ...state, displayValue: formatResult(result), error: null }
      } catch (e) {
        return { ...state, displayValue: '', error: toUserMessage(e) }
      }
    }

    default:
      return state
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return { state, dispatch }
}
