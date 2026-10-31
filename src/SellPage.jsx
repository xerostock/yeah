import { useState } from 'react'

const TYPES = [
  { id: 'group', name: 'Roblox Group', emo: '👥', note: 'Sell a Roblox group you own' },
  { id: 'items', name: 'In-Game Items', emo: '🗡️', note: 'MM2, Adopt Me, Blox Fruits & more' },
  { id: 'limiteds', name: 'Roblox Limiteds', emo: '🎩', note: 'Limited UGC & classic limiteds' },
  { id: 'funds', name: 'Group Funds', emo: '💰', note: 'Robux sitting in your group' },
  { id: 'account', name: 'Roblox Account', emo: '🔐', note: 'Min. 1,000 Robux + 1 limited' },
]

const L = ({ t, children }) => <div><label className="cfg-l">{t}</label>{children}</div>

export default function SellPage({ go }) {
  const [type, setType] = useState('group')
  const [f, setF] = useState({ discord: '', roblox: '', link: '', details: '', price: '', robux: '', limiteds: '', amount: '', members: '', game: '' })
  const [state, setState] = useState({ busy: false, err: '', ok: false })
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const acctBad = type === 'account' && ((f.robux !== '' && +f.robux < 1000) || (f.limiteds !== '' && +f.limiteds < 1))

  const submit = async e => {
    e.preventDefault()
    setState({ busy: true, err: '', ok: false })
    try {
      const r = await fetch('/api/sell', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, ...f }) })
      const d = await r.json().catch(() => ({}))
      setState(r.ok ? { busy: false, err: '', ok: true } : { busy: false, err: d.error || 'Something went wrong', ok: false })
    } catch { setState({ busy: false, err: 'Network error', ok: false }) }
  }

  if (state.ok) return <div className="wrap"><div className="ok-box">
    <div className="ok-ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" /></svg></div>
    <h2>Request sent!</h2>
    <p className="mut" style={{ margin: '10px 0 20px' }}>Our team will review it and DM <b>{f.discord}</b> on Discord with an offer - usually within a few hours.</p>
    <a className="btn btn-pri" href="#" onClick={() => go(null)}>Back to shop</a>
  </div></div>

  return <div className="wrap">
    <div className="crumbs"><a href="#" onClick={() => go(null)}>Home</a> › <span>Sell to us</span></div>
    <div className="sec-h"><div><div className="eyebrow">Sell to us</div><h2>Get paid for your Roblox stuff</h2><p className="mut" style={{ marginTop: 6 }}>Send a request, we review it and DM you an offer on Discord. No fees, fast payouts.</p></div></div>
    <div className="cols">
      <form className="cfg" onSubmit={submit} style={{ margin: 0 }}>
        <L t="What are you selling?">
          <div className="gi-games">{TYPES.map(t => <button type="button" key={t.id} className={'gi-game' + (type === t.id ? ' on' : '')} onClick={() => setType(t.id)}><span>{t.emo}</span>{t.name}</button>)}</div>
          <div className="amt-hint">{TYPES.find(t => t.id === type).note}</div>
        </L>
        <L t="Your Discord username *"><input type="text" required placeholder="your_discord_username" value={f.discord} onChange={set('discord')} /></L>
        <L t="Roblox username"><input type="text" placeholder="Roblox username" value={f.roblox} onChange={set('roblox')} /></L>
        {(type === 'group' || type === 'funds') && <L t="Group link"><input type="text" placeholder="https://www.roblox.com/communities/..." value={f.link} onChange={set('link')} /></L>}
        {type === 'group' && <L t="Member count"><input type="number" min="0" placeholder="e.g. 2500" value={f.members} onChange={set('members')} /></L>}
        {type === 'funds' && <L t="Group funds amount (R$) *"><input type="number" min="1" required placeholder="e.g. 50000" value={f.amount} onChange={set('amount')} /></L>}
        {type === 'items' && <L t="Game"><input type="text" placeholder="e.g. Murder Mystery 2, Adopt Me" value={f.game} onChange={set('game')} /></L>}
        {type === 'account' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <L t="Robux on account * (min 1,000)"><input type="number" min="1000" required placeholder="1000" value={f.robux} onChange={set('robux')} /></L>
          <L t="Limiteds on account * (min 1)"><input type="number" min="1" required placeholder="1" value={f.limiteds} onChange={set('limiteds')} /></L>
        </div>}
        {acctBad && <div className="m-err">Accounts must have at least 1,000 Robux and 1 limited.</div>}
        <L t="Details *"><textarea className="field" required rows={5} placeholder={type === 'items' ? 'List the items / pets you want to sell' : type === 'limiteds' ? 'List the limiteds (names or links)' : 'Anything we should know - age, value, extras…'} value={f.details} onChange={set('details')} style={{ resize: 'vertical' }} /></L>
        <L t="Asking price (USD)"><input type="number" min="0" step="0.01" placeholder="Leave empty for an offer" value={f.price} onChange={set('price')} /></L>
        <button className="btn btn-pri btn-lg" disabled={state.busy || acctBad}>{state.busy ? 'Sending…' : 'Send sell request'}</button>
        <div className="m-err">{state.err}</div>
      </form>
      <div className="panel summary">
        <h3 style={{ marginBottom: 12 }}>How selling works</h3>
        <div className="hiw" style={{ gridTemplateColumns: '1fr', gap: 10 }}>
          {[['Send a request', 'Fill in the form with what you want to sell.'], ['Get an offer', 'We DM you on Discord with a price.'], ['Get paid', 'Hand it over in a ticket and get paid instantly.']].map(([h, p], i) =>
            <div className="step" key={h} style={{ padding: 14 }}><div className="num" style={{ width: 30, height: 30, marginBottom: 8 }}>{i + 1}</div><h3>{h}</h3><p>{p}</p></div>)}
        </div>
        <div className="note" style={{ marginTop: 12 }}><span>Accounts must have <b>at least 1,000 Robux and 1 limited</b> to be accepted.</span></div>
      </div>
    </div>
  </div>
}
