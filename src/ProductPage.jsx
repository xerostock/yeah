import { useState } from 'react'

export const CONFIG = {
  robux: {
    cat: 'Roblox · Currency', unit: 'Robux', rate: 3, min: 5000, max: 5000000,
    deals: [[7500, 19.99], [10000, 24.99], [25000, 59.99], [35000, 79.99], [50000, 114.99], [75000, 169.99], [100000, 219.99], [150000, 319.99], [250000, 524.99], [350000, 719.99], [500000, 999.99]],
    methods: [
      { id: 'gamepass', name: 'Gamepass', mult: 1, note: 'Sent via gamepass' },
      { id: 'roblox_plus', name: 'Roblox Plus Transfer', mult: 2, note: 'Sent straight to your account - no gamepass' },
      { id: 'account', name: 'Pre-Loaded Account', mult: 2, note: 'Account already loaded with your Robux' },
      { id: 'giftcard', name: 'Roblox Giftcard', mult: 2.5, note: 'Giftcard code' },
    ],
    field: m => m === 'gamepass' ? ['Your gamepass link (optional now)', 'https://www.roblox.com/game-pass/...'] : m === 'roblox_plus' ? ['Your Roblox username', 'Roblox username'] : null,
  },
  vbucks: {
    cat: 'Fortnite · Currency', unit: 'V-Bucks', rate: 4, min: 2500, max: 1000000,
    deals: [[5000, 14.99], [13500, 29.99], [27000, 54.99], [54000, 99.99]],
    methods: [
      { id: 'gift', name: 'Gifted', mult: 1, note: 'Items gifted to your Epic account' },
      { id: 'giftcard', name: 'Giftcard', mult: 1, note: 'V-Bucks giftcard code' },
      { id: 'account', name: 'Loaded Account', mult: 1, note: 'Account already loaded with your V-Bucks' },
    ],
    field: m => m === 'gift' ? ['Your Epic Games username', 'Epic display name'] : null,
  },
}

const fmt = n => n.toLocaleString()
const Ic = ({ d }) => <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>

export default function ProductPage({ p, onAdd, onBack }) {
  const c = CONFIG[p.id]
  const [amt, setAmt] = useState(c.min)
  const [method, setMethod] = useState(c.methods[0].id)
  const [open, setOpen] = useState(false)
  const [extra, setExtra] = useState('')
  const m = c.methods.find(x => x.id === method)
  const deal = c.deals.find(d => d[0] === amt)
  const base = deal ? deal[1] : Math.round(amt / 1000 * c.rate * 100) / 100
  const price = Math.round(base * m.mult * 100) / 100
  const field = c.field(method)
  const valid = amt >= c.min && amt <= c.max
  const item = { ...p, name: `${fmt(amt)} ${c.unit} (${m.name})`, price }

  return <div className="wrap">
    <div className="crumbs"><a href="#" onClick={onBack}>Shop</a> › <span>{p.name}</span></div>
    <div className="pdp">
      <div className="pdp-media">
        <div className="pdp-hero"><img src={`/icons/${p.id}.png`} alt={p.name} /></div>
        <div className="pdp-assur">
          <div className="a"><Ic d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />Instant delivery</div>
          <div className="a"><Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />Secure via Discord</div>
          <div className="a"><Ic d="M20 6L9 17l-5-5" />5.3K+ Reviews</div>
          <div className="a"><Ic d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />24/7 support</div>
        </div>
      </div>
      <div>
        <div className="pdp-cat">{c.cat}</div>
        <h1 className="pdp-name"><img className="pdp-name-ic" src={`/icons/${p.id}.png`} alt="" />{p.name}</h1>
        <div className="pdp-rate"><span className="stars">★★★★★</span><b>4.90</b> (490 Reviews) · <span className="badge ok">In Stock</span></div>
        <div className="pdp-price">${price.toFixed(2)}</div>
        <div className="cfg">
          <div>
            <label className="cfg-l">Amount ({c.unit})</label>
            <div className="amt-row"><input type="number" value={amt} min={c.min} max={c.max} onChange={e => setAmt(+e.target.value || 0)} /><span className="amt-unit">{c.unit}</span></div>
            <input type="range" min={c.min} max={c.max} step={500} value={Math.min(Math.max(amt, c.min), c.max)} onChange={e => setAmt(+e.target.value)} style={{ marginTop: 14 }} />
            <div className="amt-hint" style={{ color: valid ? undefined : 'var(--danger)' }}>Min {fmt(c.min)} · Max {fmt(c.max)}</div>
          </div>
          <div>
            <label className="cfg-l">Exclusive time-limited deals</label>
            <div className="deals">{c.deals.map(([a, pr]) => <button key={a} className={'deal' + (amt === a ? ' on' : '')} onClick={() => setAmt(a)}>{fmt(a)} · ${pr}</button>)}</div>
          </div>
          <div>
            <label className="cfg-l">Delivery method</label>
            <div className={'cselect' + (open ? ' on' : '')}>
              <button className="cselect-btn" onClick={() => setOpen(!open)}>{m.name} · {m.mult}x → ${price.toFixed(2)}<span className="cselect-caret">›</span></button>
              <div className="cselect-menu">{c.methods.map(x => <button key={x.id} className="cselect-opt" onClick={() => { setMethod(x.id); setOpen(false); setExtra('') }}>
                <span className="cselect-row"><span className="cselect-lb">{x.name} · {x.mult}x<br /><small className="mut">{x.note}</small></span><span className="cselect-pr">${(Math.round(base * x.mult * 100) / 100).toFixed(2)}</span></span>
              </button>)}</div>
            </div>
          </div>
          {field && <div><label className="cfg-l">{field[0]}</label><input type="text" placeholder={field[1]} value={extra} onChange={e => setExtra(e.target.value)} /></div>}
        </div>
        <div className="pdp-actions">
          <button className="btn btn-pri" disabled={!valid} onClick={() => onAdd(item)}>Add to Cart</button>
          <button className="btn" disabled={!valid} onClick={() => onAdd(item)}>Buy Now</button>
        </div>
      </div>
    </div>
  </div>
}
