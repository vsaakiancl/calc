import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'

describe('useCalculator()', () => {
  describe('initial state', () => {
    it('starts with empty expression', () => {
      const { result } = renderHook(() => useCalculator())
      expect(result.current.state.expression).toBe('')
    })
    it('starts with empty displayValue', () => {
      const { result } = renderHook(() => useCalculator())
      expect(result.current.state.displayValue).toBe('')
    })
    it('starts with null error', () => {
      const { result } = renderHook(() => useCalculator())
      expect(result.current.state.error).toBeNull()
    })
    it('starts with zero openParenCount', () => {
      const { result } = renderHook(() => useCalculator())
      expect(result.current.state.openParenCount).toBe(0)
    })
  })

  describe('APPEND_TOKEN — DISP-01', () => {
    it('appends token to expression', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '5' }))
      expect(result.current.state.expression).toBe('5')
    })
    it('increments openParenCount on (', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '(' }))
      expect(result.current.state.openParenCount).toBe(1)
    })
    it('decrements openParenCount on )', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '(' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: ')' }))
      expect(result.current.state.openParenCount).toBe(0)
    })
    it('clears error on token append', () => {
      const { result } = renderHook(() => useCalculator())
      // Force an error state first
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '2' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '*' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '/' }))
      act(() => result.current.dispatch({ type: 'EQUALS' }))
      // Then append a token — error should clear
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '1' }))
      expect(result.current.state.error).toBeNull()
    })
    it('does not append beyond 200 chars', () => {
      const { result } = renderHook(() => useCalculator())
      // Build a 200-char expression
      for (let i = 0; i < 200; i++) {
        act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '1' }))
      }
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '9' }))
      expect(result.current.state.expression.length).toBe(200)
    })
  })

  describe('EQUALS — DISP-02', () => {
    it('sets displayValue to formatted result', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '2' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '+' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '3' }))
      act(() => result.current.dispatch({ type: 'EQUALS' }))
      expect(result.current.state.displayValue).toBe('5')
    })
    it('sets error on invalid expression', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '2' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '*' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '/' }))
      act(() => result.current.dispatch({ type: 'EQUALS' }))
      expect(result.current.state.error).not.toBeNull()
      expect(result.current.state.displayValue).toBe('')
    })
    it('keeps expression visible after EQUALS', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '4' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '+' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '1' }))
      act(() => result.current.dispatch({ type: 'EQUALS' }))
      expect(result.current.state.expression).toBe('4+1')
    })
  })

  describe('CLEAR — DISP-03', () => {
    it('resets expression to empty', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '5' }))
      act(() => result.current.dispatch({ type: 'CLEAR' }))
      expect(result.current.state.expression).toBe('')
    })
    it('resets displayValue to empty', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '5' }))
      act(() => result.current.dispatch({ type: 'EQUALS' }))
      act(() => result.current.dispatch({ type: 'CLEAR' }))
      expect(result.current.state.displayValue).toBe('')
    })
    it('resets error to null', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '2' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '*' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '/' }))
      act(() => result.current.dispatch({ type: 'EQUALS' }))
      act(() => result.current.dispatch({ type: 'CLEAR' }))
      expect(result.current.state.error).toBeNull()
    })
    it('resets openParenCount to 0', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '(' }))
      act(() => result.current.dispatch({ type: 'CLEAR' }))
      expect(result.current.state.openParenCount).toBe(0)
    })
  })

  describe('BACKSPACE — DISP-04', () => {
    it('removes last character from expression', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '5' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '3' }))
      act(() => result.current.dispatch({ type: 'BACKSPACE' }))
      expect(result.current.state.expression).toBe('5')
    })
    it('decrements openParenCount when last char was (', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '(' }))
      act(() => result.current.dispatch({ type: 'BACKSPACE' }))
      expect(result.current.state.openParenCount).toBe(0)
    })
    it('increments openParenCount when last char was )', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '(' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: ')' }))
      act(() => result.current.dispatch({ type: 'BACKSPACE' }))
      expect(result.current.state.openParenCount).toBe(1)
    })
    it('clears error on backspace', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '2' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '*' }))
      act(() => result.current.dispatch({ type: 'APPEND_TOKEN', payload: '/' }))
      act(() => result.current.dispatch({ type: 'EQUALS' }))
      act(() => result.current.dispatch({ type: 'BACKSPACE' }))
      expect(result.current.state.error).toBeNull()
    })
    it('does nothing on empty expression', () => {
      const { result } = renderHook(() => useCalculator())
      act(() => result.current.dispatch({ type: 'BACKSPACE' }))
      expect(result.current.state.expression).toBe('')
      expect(result.current.state.openParenCount).toBe(0)
    })
  })
})
