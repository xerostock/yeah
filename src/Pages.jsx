import { useState } from 'react'
import { GUIDES, DISCORD_HTML } from './guides.js'

export const INVITE = 'https://discord.gg/saintcc'
export const PAY = ['card', 'applepay', 'googlepay', 'cashapp', 'venmo', 'zelle', 'wise', 'paysafecard', 'btc', 'eth', 'ltc', 'sol', 'usdt']
const money = n => '$' + n.toFixed(2)
const DC = <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.6 1.3a18.3 18.3 0 0 0-5.5 0L8.7 3a19.7 19.7 0 0 0-4.9 1.4C.6 9.1-.3 13.6.1 18.1a19.9 19.9 0 0 0 6 3l1.3-2.1a13 13 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4a13 13 0 0 1-2 1l1.3 2.1a19.8 19.8 0 0 0 6-3c.5-5.2-.9-9.7-3.6-13.7zM8 15.3c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.5 8 10.5s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4z" /></svg>

// Turns clicks on <a href="/..."> inside cloned HTML into in-app navigation
const ROUTES = { '/robux': 'p:robux', '/product/robux': 'p:robux', '/vbucks': 'p:vbucks', '/product/limiteds': 'p:limiteds', '/discord': 'discord', '/guides': 'guides' }
const linkHandler = go => e => {
  const a = e.target.closest('a'); if (!a) return
  const h = a.getAttribute('href') || ''
  const r = ROUTES[h] || (h.startsWith('/guides/') ? 'guide:' + h.slice(8) : null)
  if (r) { e.preventDefault(); go(r) }
}
const Crumbs = ({ go, items }) => <div className="crumbs"><a href="#" onClick={() => go(null)}>Home</a>{items.map(([l, r]) => <span key={l}> › {r ? <a href="#" onClick={() => go(r)}>{l}</a> : <span>{l}</span>}</span>)}</div>

export function GuidesPage({ go }) {
  return <div className="wrap"><Crumbs go={go} items={[['Guides']]} />
    <div className="sec-h"><div><div className="eyebrow">Guides</div><h2>Guides &amp; Help</h2></div></div>
    <div className="grid">{Object.entries(GUIDES).map(([k, g]) => <a key={k} className="pcard" href="#" onClick={() => go('guide:' + k)}><div className="pcard-body" style={{ padding: 18 }}>
      <div className="pcard-cat">Guide</div><div className="pcard-name">{g.title}</div><p className="mut" style={{ fontSize: '.86rem' }}>{g.desc}</p>
      <div className="pcard-foot"><span className="mut" style={{ fontSize: '.82rem' }}>Read ›</span></div></div></a>)}</div>
  </div>
}

export function GuidePage({ slug, go }) {
  const g = GUIDES[slug]
  if (!g) return <GuidesPage go={go} />
  return <div className="wrap"><Crumbs go={go} items={[['Guides', 'guides'], [g.title]]} />
    <article className="pinfo" style={{ margin: '14px 0 40px', maxWidth: 760 }} onClick={linkHandler(go)}>
      <h1 style={{ marginBottom: 14 }}>{g.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: g.body }} />
      <p style={{ marginTop: 22 }}><a className="btn btn-pri" href="#" onClick={() => go(null)}>Start shopping</a></p>
    </article></div>
}

export function DiscordPage({ go }) {
  return <div className="wrap"><Crumbs go={go} items={[['Discord']]} />
    <div className="dc-cta" style={{ marginTop: 14 }}><div className="dc-cta-l">
      <h1 style={{ color: '#fff', fontSize: '2.1rem', marginBottom: 14, lineHeight: 1.15 }}>Buy Robux on Discord</h1>
      <p>Saint Services is the #1 Discord shop for <b>cheap Robux</b>. Buy Robux, Limiteds and V-Bucks on Discord with instant, secure delivery. Join our server and order in seconds.</p>
      <a className="dc-cta-btn" href={INVITE} target="_blank" rel="noopener">Join our Discord</a>
    </div></div>
    <div onClick={linkHandler(go)} dangerouslySetInnerHTML={{ __html: DISCORD_HTML }} />
  </div>
}

function Summary({ cart, promo, setPromo, children }) {
  const [code, setCode] = useState(promo || '')
  const [msg, setMsg] = useState('')
  const sub = cart.reduce((s, p) => s + p.price, 0)
  return <div className="panel summary">
    <h3 style={{ marginBottom: 10 }}>Order summary</h3>
    <div style={{ maxHeight: 260, overflowY: 'auto' }}>{cart.map((it, i) => <div className="sumrow" key={i}><span>{it.name}</span><span>{money(it.price)}</span></div>)}</div>
    <div className="promo-in"><input placeholder="Promo code" value={code} onChange={e => setCode(e.target.value)} /><button className="btn" onClick={() => { setPromo(null); setMsg(code.trim() ? 'Invalid code' : '') }}>Apply</button></div>
    <div className="mut" style={{ fontSize: '.82rem', minHeight: 16, color: msg ? 'var(--danger)' : undefined }}>{msg}</div>
    <div className="sumrow"><span>Subtotal</span><span>{money(sub)}</span></div>
    <div className="sumrow tot"><span>Total</span><b>{money(sub)}</b></div>
    {children}
  </div>
}

export function CartPage({ cart, setCart, go }) {
  const [promo, setPromo] = useState(null)
  if (!cart.length) return <div className="wrap"><Crumbs go={go} items={[['Cart']]} /><div className="ok-box"><h2>Your cart is empty</h2><p className="mut" style={{ margin: '10px 0 20px' }}>Browse the store and add your first product.</p><a className="btn btn-pri" href="#" onClick={() => go(null)}>Continue shopping</a></div></div>
  return <div className="wrap"><Crumbs go={go} items={[['Cart']]} />
    <h1 style={{ margin: '6px 0 14px' }}>Your Cart</h1>
    <div className="cols">
      <div className="panel">{cart.map((p, i) => <div className="crow" key={i}><img src={p.img || `/icons/${p.id}.png`} alt="" /><div style={{ flex: 1 }}><div className="ci-n">{p.name}</div><div className="ci-p">{money(p.price)}</div></div><span className="ci-rm" onClick={() => setCart(c => c.filter((_, j) => j !== i))}>Remove</span></div>)}</div>
      <Summary cart={cart} promo={promo} setPromo={setPromo}>
        <button className="btn btn-pri btn-lg" style={{ marginTop: 14 }} onClick={() => go('checkout')}>Checkout ›</button>
        <div className="note" style={{ marginTop: 12 }}><span>Payment is completed securely inside your Discord ticket after you place the order.</span></div>
      </Summary>
    </div></div>
}

export function CheckoutPage({ cart, setCart, go, user, setUser }) {
  const [promo, setPromo] = useState(null)
  const [manual, setManual] = useState(false)
  const [name, setName] = useState('')
  const [pending, setPending] = useState(null)
  const [err, setErr] = useState('')
  const [stepErr, setStepErr] = useState(false)
  const [done, setDone] = useState(null)

  if (done) return <div className="wrap"><div className="ok-box">
    <div className="ok-ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" /></svg></div>
    <h2>Order placed!</h2>
    <p className="mut" style={{ margin: '10px 0 20px' }}>Order <b>#{done}</b> for <b>{user.name}</b>. A private ticket is opening in our Discord - complete payment there and your order will be delivered in minutes.</p>
    <a className="btn btn-discord btn-lg" href={INVITE} target="_blank" rel="noopener">{DC} Open Discord</a>
    <button className="link-btn" style={{ marginTop: 12 }} onClick={() => go(null)}>Back to shop</button>
  </div></div>
  if (!cart.length) return <CartPage cart={cart} setCart={setCart} go={go} />

  const oauth = () => {
    const w = window.open('https://discord.com/login', 'discord', 'width=500,height=750')
    setPending('Discord')
    setTimeout(() => { setPending(null); w && w.close(); setUser({ name: 'discord_user', id: String(Math.floor(1e17 + Math.random() * 9e17)), avatar: 'https://cdn.discordapp.com/embed/avatars/0.png' }) }, 2500)
  }
  const verify = () => {
    const n = name.trim()
    if (!/^[a-z0-9_.]{2,32}$/i.test(n)) return setErr('Enter a valid Discord username (2-32 letters, numbers, _ or .)')
    setErr(''); setPending(n)
    setTimeout(() => { setPending(null); setUser({ name: n, id: null, avatar: `https://cdn.discordapp.com/embed/avatars/${n.length % 6}.png` }) }, 2500)
  }
  const place = () => {
    if (!user) { setStepErr(true); document.getElementById('step1')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    setDone(Math.floor(100000 + Math.random() * 900000)); setCart([])
  }

  return <div className="wrap"><Crumbs go={go} items={[['Cart', 'cart'], ['Checkout']]} />
    <h1 style={{ margin: '6px 0 14px' }}>Checkout</h1>
    <div className="cols"><div>
      <div className={'panel' + (stepErr && !user ? ' step-err' : '')} id="step1" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12 }}>1 · Your Discord</h3>
        {user ? <div className="ident">
          <img className="ident-av" src={user.avatar} alt="" />
          <div className="ident-info"><div className="ident-name">{user.name}</div>{user.id && <div className="ident-id">ID: {user.id}</div>}
            <div className="ident-q">Is this you? Your order ticket opens for this account. <a href="#" onClick={e => { e.preventDefault(); setUser(null) }}>Not you?</a></div></div>
        </div> : pending ? <>
          <div className="ck-pending"><div className="ck-spin" /><div style={{ flex: 1 }}><b>Check your Discord DMs</b><div className="mut" style={{ fontSize: '.85rem', marginTop: 3 }}>We sent <b>{pending === 'Discord' ? 'your account' : pending}</b> a login confirmation on Discord. Approve it there and this page will continue automatically.</div></div></div>
          <button type="button" className="link-btn" style={{ marginTop: 12 }} onClick={() => setPending(null)}>Cancel / use a different account</button>
        </> : <>
          <p className="mut" style={{ fontSize: '.86rem', marginBottom: 12 }}>Log in with Discord so we know who to open your order ticket for. We'll show your account here before you place the order.</p>
          <div className="verify-box">
            <button className="btn btn-discord btn-lg" onClick={oauth}>{DC}<span>Log in with Discord</span></button>
            <button type="button" className="link-btn" onClick={() => setManual(!manual)}>Not working? Enter your username instead</button>
            <div className={'ck-user' + (manual ? ' on' : '')}>
              <div className="or">- or enter your username -</div>
              <input className="field" placeholder="your_discord_username" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && verify()} />
              <button className="btn btn-pri" onClick={verify}>Verify username</button>
              <div className="mut" style={{ fontSize: '.78rem' }}>We'll DM you a quick confirmation to make sure it's really you.</div>
              <div className="m-err">{err}</div>
            </div>
          </div>
        </>}
      </div>
      <div className="panel" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12 }}>2 · Payment</h3>
        <div className="note"><span>Choose &amp; complete payment <b>inside your Discord ticket</b> after placing the order - all major methods and crypto are accepted.</span></div>
        <div className="pay-icons">{PAY.map(p => <img key={p} src={`/icons/${p}.png`} alt={p} />)}</div>
      </div>
      <div className="panel">
        <h3 style={{ marginBottom: 12 }}>3 · Delivery</h3>
        <div className="note"><span>Once your order is placed, delivery happens <b>inside your private Discord ticket</b>. Our team will guide you through it and hand over your order there - most orders are completed within minutes.</span></div>
      </div>
    </div>
      <Summary cart={cart} promo={promo} setPromo={setPromo}>
        <button className="btn btn-pri btn-lg" style={{ marginTop: 14 }} onClick={place}>Place Order</button>
        {stepErr && !user && <div className="m-err" style={{ textAlign: 'center' }}>Log in with Discord first.</div>}
        <p className="mut" style={{ fontSize: '.82rem', margin: '10px 0 0', textAlign: 'center' }}>Your order ticket opens in our Discord once you're verified there.</p>
        <p className="mut" style={{ fontSize: '.76rem', textAlign: 'center', marginTop: 10 }}>By placing your order you agree to our <a href="#" onClick={() => go('guide:tos')} style={{ color: 'var(--accent2)' }}>Terms</a> and <a href="#" onClick={() => go('guide:privacy')} style={{ color: 'var(--accent2)' }}>Privacy Policy</a>.</p>
      </Summary>
    </div></div>
}
