import { useEffect, useMemo, useState } from 'react'
import './bux.css'
import ProductPage, { CONFIG } from './ProductPage.jsx'
import OptionPage, { OPTS, fromPrice, RobloxPlusPage, plusFrom } from './OptionPage.jsx'
import SellPage from './SellPage.jsx'
import { GuidesPage, GuidePage, DiscordPage, CartPage, CheckoutPage, INVITE, PAY } from './Pages.jsx'

const I = {
  search: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></>,
  cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></>,
  sun: <><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></>,
  moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
  chat: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  x: <path d="M18 6L6 18M6 6l12 12" />,
}
const Ic = ({ n, s = 20 }) => <svg className="ic" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{I[n]}</svg>
// eslint-disable-next-line
const Logo = ({ bg = '#E11D2A', t = 'B' }) => <div style={{ width: 96, height: 96, borderRadius: 22, background: bg, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 40, boxShadow: '0 8px 20px rgba(0,0,0,.4)' }}>{t}</div>

const PRODUCTS = [
  { id: 'robux', name: 'Robux', game: 'roblox', cat: 'Currency', price: 15.0, unit: '/ 1K', feat: true, logo: ['#E11D2A', 'R$'] },
  { id: 'limiteds', name: 'Limiteds', game: 'roblox', cat: 'Items', price: 1.5, feat: true, logo: ['#22c55e', 'L'] },
  { id: 'game-items', name: 'Game Items', game: 'roblox', cat: 'Items', price: 0.5, feat: true, logo: ['#ff7a18', 'MM2'] },
  { id: 'roblox-accounts', name: 'Roblox Accounts', game: 'roblox', cat: 'Accounts', price: 4.99, logo: ['#334155', 'RA'] },
  { id: 'roblox-plus', name: 'Roblox Plus', game: 'roblox', cat: 'Accounts', price: plusFrom, feat: true, img: '/icons/roblox.png' },
  { id: 'toy-codes', name: 'Toy Codes', game: 'roblox', cat: 'Items', price: 2.99, logo: ['#a855f7', 'TC'] },
  { id: 'vbucks', name: 'V-Bucks', game: 'fortnite', cat: 'Currency', price: 14.99, feat: true, logo: ['#3b82f6', 'V'] },
  { id: 'fortnite-accounts', name: 'Fortnite Accounts', game: 'fortnite', cat: 'Accounts', price: 9.99, logo: ['#6366f1', 'FA'] },
]
PRODUCTS.forEach(p => { if (OPTS[p.id]) p.price = fromPrice(p.id) })
const GAMES = { roblox: 'Roblox', fortnite: 'Fortnite' }
// Placeholder vouches - replace with real ones from your Discord vouch channel
// [name, text, product id, days ago, avatar url (optional)]
const REVIEWS = [
  ['jxke', 'Got my 10k robux in like 3 minutes, legit.', 'robux', 1],
  ['luna.rbx', 'Best rates I have found, staff was super helpful in the ticket.', 'limiteds', 2],
  ['tyler_ftn', 'Smooth V-Bucks purchase, will buy again.', 'vbucks', 3],
  ['mxrk', 'Fast delivery on my MM2 set, 10/10.', 'game-items', 4],
  ['zayyy', 'Trusted. 5th order now, never had an issue.', 'robux', 5],
  ['kira', 'V-Bucks arrived instantly. Thanks!', 'vbucks', 6],
]
const money = n => '$' + n.toFixed(2)

function Card({ p, onAdd }) {
  return <div className="pcard" onClick={() => onAdd(p)}>
    <div className="pcard-img">{p.feat && <span className="pcard-feat">HOT</span>}<img src={p.img || `/icons/${p.id}.png`} alt={p.name} /></div>
    <div className="pcard-body">
      <div className="pcard-cat">{GAMES[p.game]} · {p.cat}</div>
      <div className="pcard-name">{p.name}</div>
      <div className="pcard-rate"><span className="stars">★★★★★</span> 4.9</div>
      <div className="pcard-foot"><div className="pcard-price"><span className="from">from</span>{money(p.price)}</div><span className="badge ok">In stock</span></div>
    </div>
  </div>
}

export default function BuxApp() {
  const [theme, setTheme] = useState('dark')
  const [game, setGame] = useState(null)
  const [cat, setCat] = useState(null)
  const [sort, setSort] = useState('featured')
  const [q, setQ] = useState('')
  const [cart, setCart] = useState([])
  const [drawer, setDrawer] = useState(false)
  const [chat, setChat] = useState(false)

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])

  const list = useMemo(() => {
    let l = PRODUCTS.filter(p => (!game || p.game === game) && (!cat || p.cat === cat) && p.name.toLowerCase().includes(q.toLowerCase()))
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'name') l = [...l].sort((a, b) => a.name.localeCompare(b.name))
    return l
  }, [game, cat, sort, q])
  const feat = PRODUCTS.filter(p => p.feat)
  const [page, setPage] = useState(null)
  const [user, setUser] = useState(null)
  const go = r => { setDrawer(false); setPage(typeof r === 'string' && r.startsWith('p:') ? PRODUCTS.find(p => p.id === r.slice(2)) : r); window.scrollTo(0, 0) }
  const open = p => { if (CONFIG[p.id] || OPTS[p.id] || p.id === 'roblox-plus') { setPage(p); window.scrollTo(0, 0) } else add(p) }
  const add = p => { setCart(c => [...c, p]); setDrawer(true) }
  const total = cart.reduce((s, p) => s + p.price, 0)

  return <>
    <header id="nav"><div className="wrap">
      <a className="logo" href="#" onClick={() => { setGame(null); setPage(null) }}><img src="/saint-logo.png" alt="Saint Services" /><span>Saint <span className="grad">Services</span></span></a>
      <nav className="nav-links">
        <a className={!game ? 'on' : ''} href="#" onClick={() => { setGame(null); setPage(null) }}>Shop</a>
        {Object.entries(GAMES).map(([k, v]) => <a key={k} className={game === k ? 'on' : ''} href="#" onClick={() => { setGame(k); setPage(null) }}>{v}</a>)}
        <a className={page === 'sell' ? 'on' : ''} href="#" onClick={() => go('sell')}>Sell</a>
        <a className={typeof page === 'string' && page.startsWith('guide') ? 'on' : ''} href="#" onClick={() => go('guides')}>Guides</a>
      </nav>
      <div className="nav-search"><span className="ic"><Ic n="search" s={18} /></span><input placeholder="Search products…" value={q} onChange={e => setQ(e.target.value)} /></div>
      <div className="nav-right">
        <button className="iconbtn lang-btn">EN</button>
        <button className="iconbtn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Ic n={theme === 'dark' ? 'sun' : 'moon'} /></button>
        <a className="iconbtn" href={INVITE} target="_blank" rel="noopener" title="Discord"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.6 1.3a18.3 18.3 0 0 0-5.5 0L8.7 3a19.7 19.7 0 0 0-4.9 1.4C.6 9.1-.3 13.6.1 18.1a19.9 19.9 0 0 0 6 3l1.3-2.1a13 13 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12.2 0l.5.4a13 13 0 0 1-2 1l1.3 2.1a19.8 19.8 0 0 0 6-3c.5-5.2-.9-9.7-3.6-13.7zM8 15.3c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.5 8 10.5s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4z"/></svg></a>
        <button className="iconbtn" onClick={() => setDrawer(true)}><Ic n="cart" />{cart.length > 0 && <span className="cart-badge">{cart.length}</span>}</button>
      </div>
    </div></header>

    <main>{page === 'sell' ? <SellPage go={go} /> : page === 'guides' ? <GuidesPage go={go} /> : typeof page === 'string' && page.startsWith('guide:') ? <GuidePage key={page} slug={page.slice(6)} go={go} /> : page === 'discord' ? <DiscordPage go={go} /> : page === 'cart' ? <CartPage cart={cart} setCart={setCart} go={go} /> : page === 'checkout' ? <CheckoutPage cart={cart} setCart={setCart} go={go} user={user} setUser={setUser} /> : page?.id === 'roblox-plus' ? <RobloxPlusPage p={page} onAdd={add} onBack={() => setPage(null)} /> : page ? (CONFIG[page.id] ? <ProductPage key={page.id} p={page} onAdd={add} onBack={() => setPage(null)} /> : <OptionPage key={page.id} p={page} onAdd={add} onBack={() => setPage(null)} />) : <>
      <section className="hero wrap">
        <div className="statuspill"><span className="dot"></span>Online <span className="eta">· ~5 min delivery</span></div>
        <h1><span className="grad">Saint Services</span><sup style={{ fontSize: '.4em', color: 'var(--accent2)', marginLeft: 4 }}>™</sup></h1>
        <p className="sub">Robux, Limiteds, accounts, V-Bucks &amp; more - the best rates, instant delivery, fulfilled securely through Discord.</p>
        <div className="hero-search"><Ic n="search" /><input placeholder="Search products…" value={q} onChange={e => setQ(e.target.value)} /><button className="btn btn-pri" onClick={() => document.getElementById('allHead').scrollIntoView({ behavior: 'smooth' })}>Search</button></div>
        <div className="trust">
          {[['$3.00', 'Robux / 1K'], ['7,316', 'Orders'], ['4.9★', 'Rating'], ['21,531', 'Members']].map(([n, l]) => <div className="t" key={l}><div className="n">{n}</div><div className="l">{l}</div></div>)}
        </div>
      </section>

      <div className="wrap">
        <div className="toolbar">
          <div className="tabs">
            {[[null, 'All'], ...Object.entries(GAMES)].map(([k, v]) => <button key={v} className={'tab' + (game === k ? ' on' : '')} onClick={() => setGame(k)}>{v}</button>)}
          </div>
          <div className="toolbar-right">
            <div className="chips">
              {[[null, 'All types'], ['Currency', 'Currency'], ['Accounts', 'Accounts'], ['Items', 'Items']].map(([k, v]) => <button key={v} className={'chip' + (cat === k ? ' on' : '')} onClick={() => setCat(k)}>{v}</button>)}
            </div>
            <select className="sel" value={sort} onChange={e => setSort(e.target.value)} style={{ minWidth: 190 }}>
              <option value="featured">Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        <div className="sec-h"><div><div className="eyebrow">★ Bestsellers</div><h2>Featured products</h2></div></div>
        <div className="frow"><div className="marquee">{[...feat, ...feat, ...feat, ...feat].map((p, i) => <Card key={i} p={p} onAdd={open} />)}</div></div>

        <div className="sec-h" id="allHead"><h2>All products</h2><span className="mut">{list.length} products</span></div>
        <div className="grid">{list.length ? list.map(p => <Card key={p.id} p={p} onAdd={open} />) : <div className="empty" style={{ gridColumn: '1/-1' }}>No products found.</div>}</div>
      </div>

      <section className="wrap" style={{ marginTop: 46 }}>
        <div className="sec-h"><div><div className="eyebrow">How it works</div><h2>Buy in 3 simple steps</h2></div></div>
        <div className="hiw">
          {[['Pick your product', 'Browse the store, choose your amount or item, and add it to your cart.'], ['Verify your Discord', 'Enter your username or log in with Discord - this opens your private order ticket.'], ['Pay & get delivered', 'Complete payment safely inside your Discord ticket and receive your order in minutes.']].map(([h, p], i) =>
            <div className="step" key={h}><div className="num">{i + 1}</div><h3>{h}</h3><p>{p}</p></div>)}
        </div>
      </section>

      <section className="wrap" style={{ marginTop: 46 }}>
        <div className="sec-h"><div><div className="eyebrow">★ Reviews</div><h2>Reviews</h2></div></div>
        <div className="vouches">
          {REVIEWS.map(([n, b, pid, days, av], i) => { const p = PRODUCTS.find(x => x.id === pid); const d = new Date(Date.now() - days * 864e5); return <div className="vch" key={n}>
            <div className="vch-top"><img className="vch-av" src={av || `https://cdn.discordapp.com/embed/avatars/${i % 6}.png`} alt="" /><div><div className="vch-name">{n}</div><div className="vch-date">{d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div></div><span className="stars" style={{ marginLeft: 'auto' }}>★★★★★</span></div>
            <div className="vch-body">{b}</div>
            <div className="vch-buy" style={{ display: 'flex', alignItems: 'center', gap: 7 }}><img src={PRODUCTS.find(x => x.id === pid)?.img || `/icons/${pid}.png`} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />Purchased: {p?.name}</div>
          </div> })}
        </div>
        <div className="dc-cta">
          <div className="dc-cta-l">
            <h2>Join Our Discord Server</h2>
            <p>Connect with our team, join the community and get exclusive deals, giveaways and updates. Your presence matters - join the excitement today!</p>
            <a className="dc-cta-btn" href={INVITE} target="_blank" rel="noopener">Join</a>
          </div>
        </div>
      </section>
    </>}</main>

    <footer id="foot"><div className="wrap">
      <div className="foot-grid">
        <div className="foot-col"><a className="logo" href="#" style={{ marginBottom: 12 }}><img src="/saint-logo.png" alt="Saint Services" /><span>Saint <span className="grad">Services</span></span></a>
          <p className="mut" style={{ fontSize: '.88rem', maxWidth: 280 }}>The premium game marketplace - best rates, instant delivery, secured through Discord.</p></div>
        <div className="foot-col"><h4>Shop</h4>{[['Robux', 'robux'], ['Limiteds', 'limiteds'], ['V-Bucks', 'vbucks'], ['Game Items', 'game-items'], ['Roblox Accounts', 'roblox-accounts'], ['Fortnite Accounts', 'fortnite-accounts'], ['Toy Codes', 'toy-codes'], ['Roblox Plus', 'roblox-plus']].map(([x, r]) => <a key={x} href="#" onClick={() => go('p:' + r)}>{x}</a>)}</div>
        <div className="foot-col"><h4>Help</h4>{[['Guides', 'guides'], ['Verified Badge', 'guide:verified-badge'], ['FAQ', 'guide:faq'], ['Terms of Service', 'guide:tos'], ['Privacy Policy', 'guide:privacy'], ['Buy Robux on Discord', 'discord'], ['Sell to us', 'sell']].map(([x, r]) => <a key={x} href="#" onClick={() => go(r)}>{x}</a>)}<a href={INVITE} target="_blank" rel="noopener">Discord</a></div>
        <div className="foot-col"><h4>Payments</h4><div className="pay-icons">{PAY.map(x => <img key={x} src={`/icons/${x}.png`} alt={x} title={x} />)}</div></div>
      </div>
      <div className="foot-bottom"><span>© {new Date().getFullYear()} Saint Services. All rights reserved.</span><span>Not affiliated with Roblox or Epic Games.</span></div>
    </div></footer>

    <div className={'drawer-bg' + (drawer ? ' on' : '')} onClick={() => setDrawer(false)} />
    <aside className={'drawer' + (drawer ? ' on' : '')}>
      <div className="drawer-h"><h3>Your Cart</h3><button className="iconbtn" onClick={() => setDrawer(false)}><Ic n="x" /></button></div>
      <div className="drawer-items">{cart.length ? cart.map((p, i) => <div className="ci" key={i}><img src={p.img || `/icons/${p.id}.png`} alt="" /><div><div className="ci-n">{p.name}</div><div className="ci-p">{money(p.price)}</div></div><div className="ci-right"><span className="ci-rm" onClick={() => setCart(c => c.filter((_, j) => j !== i))}>Remove</span></div></div>) : <div className="empty">Your cart is empty</div>}</div>
      {cart.length > 0 && <div className="drawer-foot"><div className="drawer-sub"><span>Subtotal</span><b>{money(total)}</b></div><button className="btn btn-pri btn-lg" onClick={() => go('checkout')}>Checkout</button><button className="btn" onClick={() => go('cart')}>View Cart</button></div>}
    </aside>

    <button className={'chat-fab' + (chat ? ' hide' : '')} onClick={() => setChat(true)}><Ic n="chat" s={26} /></button>
    <div className={'chat-panel' + (chat ? ' on' : '')}>
      <div className="chat-head"><div className="chat-head-l"><span className="chat-avatar"><Ic n="chat" /></span><div><div className="chat-title">Saint Support</div><div className="chat-status"><span className="chat-dot"></span>Typically replies in minutes</div></div></div>
        <button className="chat-icbtn" onClick={() => setChat(false)}><Ic n="x" /></button></div>
      <div className="chat-msgs"><div className="chat-msg bot">Hi! 👋 How can I help you today?</div></div>
      <form className="chat-input" onSubmit={e => e.preventDefault()}><input placeholder="Ask about products, delivery, payments…" /><button className="chat-send" type="submit"><Ic n="chat" /></button></form>
    </div>
  </>
}
