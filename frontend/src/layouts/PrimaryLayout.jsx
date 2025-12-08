import PropTypes from 'prop-types'
import './PrimaryLayout.css'

function PrimaryLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Dutch Tax Planner</h1>
        <p>Quick Box 3 estimates for Dutch taxpayers.</p>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <small>Educational use only — not official advice.</small>
      </footer>
    </div>
  )
}

PrimaryLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PrimaryLayout
