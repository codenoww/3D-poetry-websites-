import { poems } from '../data/poems.js'

export function Poems() {
  return (
    <section id="content" className="content-page">
      <p className="eyebrow">East</p>
      <h1>Poems</h1>
      <div className="poem-grid">
        {poems.map((poem) => (
          <article className="poem-card" key={poem.id}>
            <h2>{poem.title}</h2>
            <p>{poem.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
