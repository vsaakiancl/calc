import { useCalculator } from './hooks/useCalculator'
import { CalculatorShell } from './components/CalculatorShell/CalculatorShell'
import { DisplayPanel } from './components/DisplayPanel/DisplayPanel'
import { ButtonGrid } from './components/ButtonGrid/ButtonGrid'

function App() {
  const { state, dispatch } = useCalculator()

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CalculatorShell>
        <DisplayPanel
          expression={state.expression}
          displayValue={state.displayValue}
          error={state.error}
        />
        <ButtonGrid
          openParenCount={state.openParenCount}
          dispatch={dispatch}
        />
      </CalculatorShell>
    </div>
  )
}

export default App
