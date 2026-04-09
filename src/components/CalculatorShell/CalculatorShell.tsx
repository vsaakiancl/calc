interface CalculatorShellProps {
  children: React.ReactNode
}

export function CalculatorShell({ children }: CalculatorShellProps) {
  return (
    <div
      style={{
        maxWidth: '360px',
        margin: '2rem auto',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      {children}
    </div>
  )
}
