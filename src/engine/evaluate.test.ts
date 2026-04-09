import { describe, it, expect } from 'vitest'
import { evaluate, toUserMessage } from './evaluate'

describe('evaluate()', () => {
  describe('CORE-01: arithmetic with PEMDAS', () => {
    it('evaluates addition and multiplication with correct precedence', () => {
      expect(evaluate('2 + 3 * 4')).toBe(14)
    })
    it('evaluates division and subtraction', () => {
      expect(evaluate('10 / 2 - 1')).toBe(4)
    })
    it('handles unary minus at expression start', () => {
      expect(evaluate('-5 + 3')).toBe(-2)
    })
    it('handles unary minus mid-expression', () => {
      expect(evaluate('3 * -2')).toBe(-6)
    })
  })

  describe('CORE-02: parentheses override PEMDAS', () => {
    it('applies parens before operator precedence', () => {
      expect(evaluate('(2 + 3) * 4')).toBe(20)
    })
  })

  describe('CORE-03: error handling', () => {
    it('throws on empty expression', () => {
      expect(() => evaluate('')).toThrow()
    })
    it('throws on whitespace-only expression', () => {
      expect(() => evaluate('   ')).toThrow()
    })
    it('throws on double operator', () => {
      expect(() => evaluate('2*/3')).toThrow()
    })
    it('throws on unclosed paren', () => {
      expect(() => evaluate('(2 + 3')).toThrow()
    })
    it('throws on division by zero (Infinity)', () => {
      expect(() => evaluate('1/0')).toThrow()
    })
    it('throws on non-numeric identifier', () => {
      expect(() => evaluate('abc')).toThrow()
    })
  })
})

describe('toUserMessage()', () => {
  it('maps "Unexpected end" to Syntax error', () => {
    expect(toUserMessage(new Error('Unexpected end of expression'))).toBe('Syntax error')
  })
  it('maps "Unexpected operator" to Syntax error', () => {
    expect(toUserMessage(new Error('Unexpected operator +'))).toBe('Syntax error')
  })
  it('maps "Division by zero" to Division by zero', () => {
    expect(toUserMessage(new Error('Division by zero'))).toBe('Division by zero')
  })
  it('maps "Empty expression" to Enter an expression', () => {
    expect(toUserMessage(new Error('Empty expression'))).toBe('Enter an expression')
  })
  it('returns generic Error for unknown messages', () => {
    expect(toUserMessage(new Error('something else entirely'))).toBe('Error')
  })
  it('returns generic Error for non-Error values', () => {
    expect(toUserMessage('not an error')).toBe('Error')
    expect(toUserMessage(42)).toBe('Error')
  })
})
