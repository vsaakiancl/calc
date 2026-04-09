import { BUTTON_CONFIG } from '../../constants/buttons'
import type { Action } from '../../types/calculator'
import { Button } from './Button'

interface ButtonGridProps {
  openParenCount: number
  dispatch: React.Dispatch<Action>
}

export function ButtonGrid({ openParenCount, dispatch }: ButtonGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.5rem',
      }}
    >
      {BUTTON_CONFIG.map((btn) => {
        const isDisabled = btn.disabledWhen === 'noOpenParens' && openParenCount === 0
        return (
          <Button
            key={btn.label}
            label={btn.label}
            variant={btn.variant}
            disabled={isDisabled}
            onClick={() => dispatch(btn.action)}
          />
        )
      })}
    </div>
  )
}
