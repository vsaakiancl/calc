import type { ButtonVariant } from '../../types/calculator'

interface ButtonProps {
  label: string
  onClick: () => void
  variant: ButtonVariant
  disabled?: boolean
}

export function Button({ label, onClick, variant, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      type="button"
      style={{ opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {label}
    </button>
  )
}
