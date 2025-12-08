import PrimaryLayout from '../layouts/PrimaryLayout.jsx'
import TaxCalculatorFeature from '../features/tax-calculator'
import ErrorBoundary from '../components/ErrorBoundary.jsx'

function App() {
  return (
    <ErrorBoundary>
      <PrimaryLayout>
        <TaxCalculatorFeature />
      </PrimaryLayout>
    </ErrorBoundary>
  )
}

export default App
