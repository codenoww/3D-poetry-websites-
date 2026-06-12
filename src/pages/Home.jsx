import { Observatory } from '../components/observatory/Observatory'

export function Home() {
  return (
    <section id="content" className="home-page observatory-home">

      <div className="hero-text">
        <p className="eyebrow">
          Observatory
        </p>

        <h1>
          Look Closer.
        </h1>

        <p className="intro">
          Forty-eight observations are scattered throughout the sky.
        </p>
      </div>

      <div style={{ height: '100vh' }}>
  <Observatory />
</div>

    </section>
  )
}