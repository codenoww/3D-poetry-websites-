import './ObservatoryLens.css'

const fragments = [
  {
    id: 1,
    text: 'the birds knew first',
    x: '18%',
    y: '24%',
  },
  {
    id: 2,
    text: 'November 12',
    x: '72%',
    y: '28%',
  },
  {
    id: 3,
    text: '02:17',
    x: '68%',
    y: '72%',
  },
  {
    id: 4,
    text: 'the tide was wrong',
    x: '22%',
    y: '74%',
  },
]

export function ObservatoryLens() {
  return (
    <div className="observatory-lens">
      {fragments.map((fragment) => (
        <div
          key={fragment.id}
          className="observatory-fragment"
          style={{
            left: fragment.x,
            top: fragment.y,
          }}
        >
          {fragment.text}
        </div>
      ))}
    </div>
  )
}