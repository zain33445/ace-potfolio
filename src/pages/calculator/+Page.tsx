import InteractiveEstimator from '../../components/InteractiveEstimator'

export { Page }

function Page() {
  return (
    <section className="min-h-screen pt-24 pb-20 px-6 md:px-16 bg-background relative" id="calculator-page">
      <div className="text-center max-w-2xl mx-auto mb-16 pt-12 space-y-3">
        <span className="font-mono text-xs text-primary font-bold block">[TAKEOFF_ENGINE_DEMO]</span>
        <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter">
          Instant Bid Cost Configurator
        </h2>
        <p className="font-sans text-sm text-on-surface-variant">
          Adjust parametric multipliers to generate class-3 budgetary allocations ready for estimation draft submission.
        </p>
      </div>
      <div className="max-w-5xl mx-auto">
        <InteractiveEstimator />
      </div>
    </section>
  )
}
