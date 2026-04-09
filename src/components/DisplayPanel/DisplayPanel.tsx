interface DisplayPanelProps {
  expression: string
  displayValue: string
  error: string | null
}

export function DisplayPanel({ expression, displayValue, error }: DisplayPanelProps) {
  return (
    <div>
      {/* Formula bar — DISP-01 */}
      <div
        style={{ overflowX: 'auto', whiteSpace: 'nowrap', minHeight: '1.5rem' }}
        aria-label="expression"
      >
        {expression || '\u00A0'}
      </div>

      {/* Result / Error — DISP-02 */}
      <div
        style={{ color: error ? 'red' : 'inherit', minHeight: '2rem' }}
        aria-label={error ? 'error' : 'result'}
      >
        {error ? error : displayValue || '\u00A0'}
      </div>
    </div>
  )
}
