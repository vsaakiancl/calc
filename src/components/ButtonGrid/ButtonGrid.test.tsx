import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ButtonGrid } from './ButtonGrid'
import { BUTTON_CONFIG } from '../../constants/buttons'

describe('ButtonGrid — INPT-01', () => {
  it('renders all buttons from BUTTON_CONFIG', () => {
    const dispatch = vi.fn()
    render(<ButtonGrid openParenCount={0} dispatch={dispatch} />)
    // Every label in BUTTON_CONFIG should appear in the DOM
    BUTTON_CONFIG.forEach((btn) => {
      expect(screen.getByText(btn.label)).toBeDefined()
    })
  })

  it('renders exactly BUTTON_CONFIG.length buttons', () => {
    const dispatch = vi.fn()
    render(<ButtonGrid openParenCount={0} dispatch={dispatch} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(BUTTON_CONFIG.length)
  })

  it('disables ) button when openParenCount is 0', () => {
    const dispatch = vi.fn()
    render(<ButtonGrid openParenCount={0} dispatch={dispatch} />)
    const closeParenBtn = screen.getByText(')')
    expect(closeParenBtn).toBeDisabled()
  })

  it('enables ) button when openParenCount is 1', () => {
    const dispatch = vi.fn()
    render(<ButtonGrid openParenCount={1} dispatch={dispatch} />)
    const closeParenBtn = screen.getByText(')')
    expect(closeParenBtn).not.toBeDisabled()
  })
})
