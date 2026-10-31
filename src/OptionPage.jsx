import { useMemo, useState } from 'react'
import D from './data.json'

const HAS = new Set(D.hasImg)
const ic = (id, fb) => HAS.has(id) ? `/icons/opt/${id}.png` : fb

export const OPTS = {
  'roblox-accounts': { cat: 'Roblox · Accounts', kind: 'select', label: 'Choose bundle', opts: D.account },
  'fortnite-accounts': { cat: 'Fortnite · Accounts', kind: 'select', label: 'Choose bundle', opts: D.fortacc },
  'toy-codes': { cat: 'Roblox · Items', kind: 'select', label: 'Choose toy code', opts: D.toycodes },
  'game-items': { cat: 'Roblox · Items', kind: 'game' },
  limiteds: { cat: 'Roblox · Items', kind: 'lim' },
}
export const fromPrice = id => {
  const c = OPTS[id]
  const all = c.kind === 'select' ? c.opts : c.kind === 'game' ? D.gameitems.flatMap(g => g.items) : D.limiteds
  return Math.min(...all.map(o => o.price))
}

const Ic = ({ d }) => <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>

function Dropdown({ opts, value, onChange, fb, placeholder }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const cur = opts.find(o => o.id === value)
  const list = opts.filter(o => o.name.toLowerCase().includes(q.toLowerCase()))
  return <div className={'cselect' + (open ? ' on' : '')}>
    <button className="cselect-btn" onClick={() => setOpen(!open)}>
      {cur ? <span className="cselect-row"><img className="cselect-ic" src={ic(cur.id, fb)} alt="" /><span className="cselect-lb">{cur.name}</span><span className="cselect-pr">${cur.price.toFixed(2)}</span></span> : <span className="mut">{placeholder}</span>}
      <span className="cselect-caret">›</span>
    </button>
    <div className="cselect-menu">
      {opts.length > 8 && <input className="field" style={{ marginBottom: 5, padding: 9, fontSize: '.9rem' }} placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} autoFocus />}
      {list.map(o => <button key={o.id} className={'cselect-opt' + (o.stock === 0 ? ' oos' : '')} disabled={o.stock === 0} onClick={() => { onChange(o.id); setOpen(false) }}>
        <span className="cselect-row"><img className="cselect-ic" src={ic(o.id, fb)} alt="" /><span className="cselect-lb">{o.name}</span>{o.stock != null && <span className="li-stk">{o.stock} left</span>}<span className="cselect-pr">${o.price.toFixed(2)}</span></span>
      </button>)}
      {!list.length && <div className="mut" style={{ padding: 10 }}>No matches</div>}
    </div>
  </div>
}

export default function OptionPage({ p, onAdd, onBack }) {
  const c = OPTS[p.id]
  const fb = `/icons/${p.id}.png`
  const [game, setGame] = useState(D.gameitems[0].id)
  const opts = c.kind === 'select' ? c.opts : c.kind === 'game' ? D.gameitems.find(g => g.id === game).items : D.limiteds
  const [sel, setSel] = useState(c.kind === 'lim' ? null : opts[0].id)
  const [qty, setQty] = useState(1)
  const [q, setQ] = useState('')
  const [user, setUser] = useState('')
  const cur = opts.find(o => o.id === sel)
  const max = cur?.stock ?? 99
  const price = cur ? cur.price * qty : 0
  const limList = useMemo(() => D.limiteds.filter(l => l.name.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.price - a.price), [q])
  const hero = c.kind === 'lim' ? (cur ? cur.img : fb) : cur ? ic(cur.id, fb) : fb
  const add = () => cur && onAdd({ ...p, name: `${cur.name}${qty > 1 ? ' ×' + qty : ''}${c.kind === 'game' ? ' (' + D.gameitems.find(g => g.id === game).name + ')' : ''}`, price, img: hero })

  return <div className="wrap">
    <div className="crumbs"><a href="#" onClick={onBack}>Shop</a> › <span>{p.name}</span></div>
    <div className="pdp">
      <div className="pdp-media">
        <div className="pdp-hero"><img src={hero} alt={p.name} /></div>
        <div className="pdp-assur">
          <div className="a"><Ic d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />Instant delivery</div>
          <div className="a"><Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />Secure via Discord</div>
          <div className="a"><Ic d="M20 6L9 17l-5-5" />5.3K+ Reviews</div>
          <div className="a"><Ic d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />24/7 support</div>
        </div>
      </div>
      <div>
        <div className="pdp-cat">{c.cat}</div>
        <h1 className="pdp-name"><img className="pdp-name-ic" src={fb} alt="" />{p.name}</h1>
        <div className="pdp-rate"><span className="stars">★★★★★</span><b>4.90</b> (490 Reviews) · <span className="badge ok">In Stock</span></div>
        <div className="pdp-price">{cur ? `$${price.toFixed(2)}` : <><small>from</small> ${fromPrice(p.id).toFixed(2)}</>}</div>
        <div className="cfg">
          {c.kind === 'game' && <div>
            <label className="cfg-l">Choose game</label>
            <div className="gi-games">{D.gameitems.map(g => <button key={g.id} className={'gi-game' + (game === g.id ? ' on' : '')} onClick={() => { setGame(g.id); setSel(g.items[0].id); setQty(1) }}><img src={ic(g.id, fb)} alt="" />{g.name}</button>)}</div>
          </div>}
          {c.kind !== 'lim' && <div>
            <label className="cfg-l">{c.label || (game === 'am' ? 'Choose pet' : 'Choose item / set')}</label>
            <Dropdown key={game} opts={opts} value={sel} onChange={id => { setSel(id); setQty(1) }} fb={fb} placeholder="Select…" />
          </div>}
          {c.kind === 'lim' && <div>
            <label className="cfg-l">Search limiteds</label>
            <input type="text" placeholder="Search by name, e.g. Valkyrie" value={q} onChange={e => setQ(e.target.value)} style={{ marginBottom: 10 }} />
            {cur && <div className="lim-picked" style={{ marginBottom: 10 }}><img src={cur.img} alt="" style={{ width: 44, height: 44, borderRadius: 8 }} /><div><div className="li-n" style={{ fontWeight: 700 }}>{cur.name}</div><div className="mut" style={{ fontSize: '.8rem' }}>RAP {cur.rap.toLocaleString()} · Value {cur.value.toLocaleString()}</div></div><button className="link-btn" style={{ width: 'auto', marginLeft: 'auto' }} onClick={() => setSel(null)}>Change</button></div>}
            <div className="lim-results">{limList.map(l => <div key={l.id} className={'lim-item' + (l.stock === 0 ? ' oos' : '')} style={sel === l.id ? { borderColor: 'var(--accent)' } : undefined} onClick={() => l.stock && (setSel(l.id), setQty(1))}>
              <img src={l.img} alt="" /><div><div className="li-n">{l.name}<span className="li-stk">{l.stock} left</span></div><div className="mut" style={{ fontSize: '.76rem' }}>RAP {l.rap.toLocaleString()}</div></div><span className="li-p">${l.price.toFixed(2)}</span>
            </div>)}{!limList.length && <div className="empty" style={{ padding: 20 }}>No limiteds match “{q}”</div>}</div>
          </div>}
          {cur && <div>
            <label className="cfg-l">Quantity</label>
            <div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))}>−</button><input value={qty} readOnly /><button onClick={() => setQty(Math.min(max, qty + 1))}>+</button></div>
            {cur.stock != null && <div className="amt-hint">{cur.stock} in stock</div>}
          </div>}
          {(c.kind === 'game' || c.kind === 'lim') && <div><label className="cfg-l">Your Roblox username</label><input type="text" placeholder="Roblox username" value={user} onChange={e => setUser(e.target.value)} /></div>}
        </div>
        <div className="pdp-actions">
          <button className="btn btn-pri" disabled={!cur} onClick={add}>Add to Cart</button>
          <button className="btn" disabled={!cur} onClick={add}>Buy Now</button>
        </div>
      </div>
    </div>
  </div>
}
