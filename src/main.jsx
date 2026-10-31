import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import Stick3D from './Stick3D.jsx'
import BuxApp from './BuxApp.jsx'

const ACCENT = '#ff1493'
const LENGTHS = ['104cm', '101cm', '96cm', '92cm', '87cm', '82cm']
const SHAFTS = [
  { name: 'Core 27 Low Kick', color: '#2ec4d6', price: 0 },
  { name: 'Core 29 Low Kick', color: '#4aa3df', price: 0 },
  { name: 'Core 27', color: '#cfcfcf', price: 0 },
  { name: 'Core 29', color: '#e0e0e0', price: 0 },
  { name: 'Core 26', color: '#bdbdbd', price: 0 },
  { name: 'Core 28', color: '#a8a8a8', price: 0 },
  { name: 'Strike 25', color: '#e63946', price: 10 },
  { name: 'Strike 27', color: '#d62839', price: 10 },
  { name: 'Strike Oval 27', color: '#9b5de5', price: 15 },
  { name: 'Strike Oval 29', color: '#7b2cbf', price: 15 },
]
const BLADES = [
  { name: 'Glide Ocean / Black', color: '#1e90ff' },
  { name: 'Glide White / Black', color: '#f5f5f5' },
  { name: 'Glide Red / Black', color: '#e63946' },
  { name: 'Glide White / Pink', color: '#ff8fc7' },
  { name: 'Glide Pink / Yellow', color: '#ffd23f' },
  { name: 'Glide White / Purple', color: '#8e44ad', out: true },
  { name: 'Control Black / Silver', color: '#444' },
  { name: 'Control Sky / Pink', color: '#8ecae6' },
]
const GRIPS = [
  { name: 'Tack White', color: '#fafafa' },
  { name: 'Tack Grey', color: '#888' },
  { name: 'Tack Black', color: '#1a1a1a' },
  { name: 'Tack Sky', color: '#8ecae6' },
  { name: 'Tack Pink', color: '#ff8fc7' },
  { name: 'Wet Grip Grey/White', color: '#bbb' },
]

const h2 = { fontSize: 15, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 10px' }
const pill = (on) => ({ background: 'none', color: on ? '#fff' : '#888', border: `1px solid ${on ? '#fff' : 'transparent'}`, borderRadius: 4, padding: '8px 10px', cursor: 'pointer', textTransform: 'uppercase', fontSize: 12 })

function Pills({ title, items, value, set }) {
  return <div><h2 style={h2}>{title}</h2><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
    {items.map((i) => <button key={i} style={pill(value === i)} onClick={() => set(i)}>{i}</button>)}</div></div>
}

function Swatches({ title, items, value, set }) {
  return <section style={{ borderTop: '1px solid #333', paddingTop: 20 }}><h2 style={h2}>{title}</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))', gap: 12 }}>
      {items.map((i, idx) => <button key={i.name} disabled={i.out} onClick={() => set(idx)}
        style={{ background: 'none', border: 'none', color: value === idx ? '#fff' : '#888', cursor: i.out ? 'not-allowed' : 'pointer', fontSize: 10, textTransform: 'uppercase', opacity: i.out ? 0.4 : 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        <span style={{ width: 56, height: 56, borderRadius: 6, background: `repeating-linear-gradient(135deg, #2a2a2a 0 10px, ${i.color} 10px 13px)`, outline: value === idx ? '2px solid #fff' : '1px solid #333' }} />
        {i.name}{i.out && <span style={{ color: ACCENT }}>Out of stock</span>}
      </button>)}
    </div></section>
}

function App() {
  const [len, setLen] = useState('104cm'); const [hand, setHand] = useState('Left'); const [shape, setShape] = useState('Round')
  const [s, setS] = useState(0); const [b, setB] = useState(0); const [g, setG] = useState(0); const [text, setText] = useState('')
  const [added, setAdded] = useState(false)
  const price = 179 + SHAFTS[s].price + (text ? 10 : 0)
  const reset = () => { setLen('104cm'); setHand('Left'); setShape('Round'); setS(0); setB(0); setG(0); setText('') }
  return <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1, background: '#232323', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none', top: 16, left: 0, right: 0, textAlign: 'center', fontWeight: 800, letterSpacing: 3, fontStyle: 'italic' }}>CUSTOM STICK</div>
        <button onClick={reset} style={{ position: 'absolute', zIndex: 1, top: 16, left: 16, background: 'none', color: '#aaa', border: '1px solid #444', borderRadius: 4, padding: '6px 10px', cursor: 'pointer' }}>Reset</button>
        <Stick3D shaft={SHAFTS[s]} blade={BLADES[b]} grip={GRIPS[g]} text={text} shape={shape} accent={ACCENT} />
      </div>
      <div style={{ width: 420, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Pills title="Length" items={LENGTHS} value={len} set={setLen} />
        <Pills title="Handedness" items={['Left', 'Right']} value={hand} set={setHand} />
        <Pills title="Shape" items={['Oval', 'Round']} value={shape} set={setShape} />
        <Swatches title="Shaft" items={SHAFTS} value={s} set={setS} />
        <Swatches title="Blade" items={BLADES} value={b} set={setB} />
        <Swatches title="Grip" items={GRIPS} value={g} set={setG} />
        <section style={{ borderTop: '1px solid #333', paddingTop: 20 }}><h2 style={h2}>Custom text</h2>
          <input value={text} maxLength={10} onChange={(e) => setText(e.target.value.toUpperCase().replace(/[^A-Z0-9#ÅÄÖ]/g, ''))}
            style={{ width: '100%', boxSizing: 'border-box', background: '#1b1b1b', border: '1px solid #444', color: '#fff', padding: 10, borderRadius: 4 }} />
          <p style={{ fontSize: 11, color: '#888' }}>Up to 10 characters (A–Z, 0–9, #ÅÄÖ). +10€</p></section>
      </div>
    </div>
    <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #333', background: '#151515' }}>
      <div style={{ fontSize: 12, color: '#888' }}>{len} · {hand} · {shape} · {SHAFTS[s].name} · {BLADES[b].name} · {GRIPS[g].name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <strong style={{ fontSize: 24 }}>{price.toFixed(2)}€</strong>
        <button onClick={() => setAdded(true)} style={{ background: ACCENT, color: '#000', border: 'none', fontWeight: 800, padding: '12px 28px', cursor: 'pointer', textTransform: 'uppercase' }}>{added ? 'Added ✓' : 'Add to cart'}</button>
      </div>
    </footer>
  </div>
}

createRoot(document.getElementById('root')).render(<BuxApp />)
