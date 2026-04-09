import { describe, it, expect } from 'vitest'
import { formatResult } from './format'

describe('formatResult() — CORE-04', () => {
  it('strips IEEE 754 trailing noise from 0.1 + 0.2', () => {
    // 0.1 + 0.2 in JS = 0.30000000000000004
    expect(formatResult(0.30000000000000004)).toBe('0.3')
  })
  it('returns integer results without decimal', () => {
    expect(formatResult(14)).toBe('14')
  })
  it('limits irrational to 12 significant figures', () => {
    expect(formatResult(1 / 3)).toBe('0.333333333333')
  })
  it('handles negative numbers', () => {
    expect(formatResult(-5)).toBe('-5')
  })
  it('handles large integers cleanly', () => {
    expect(formatResult(1000000)).toBe('1000000')
  })
  it('returns correct result for 85.13 + 5.96 + 8.44 noise', () => {
    // 85.13 + 5.96 + 8.44 = 99.53 in floating point without formatting
    expect(formatResult(85.13 + 5.96 + 8.44)).toBe('99.53')
  })
})
