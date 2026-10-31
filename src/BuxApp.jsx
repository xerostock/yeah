import { useEffect, useMemo, useState } from 'react'
import './bux.css'

const I = {
  search: <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></>,
  cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></>,
  sun: <><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></>,
  moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
  chat: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  x: <path d="M18 6L6 18M6 6l12 12" />,
}
const Ic = ({ n, s = 20 }) => <svg className="ic" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{I[n]}</svg>
const Logo = ({ bg = '#E11D2A', t = 'B' }) => <div style={{ width: 96, height: 96, borderRadius: 22, background: bg, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 40, boxShadow: '0 8px 20px rgba(0,0,0,.4)' }}>{t}</div>

const PRODUCTS = [
  { id: 'robux', name: 'Robux', game: 'roblox', cat: 'Currency', price: 3.0, unit: '/ 1K', feat: true, logo: ['#E11D2A', 'R$'] },
  { id: 'limiteds', name: 'Limiteds', game: 'roblox', cat: 'Items', price: 1.5, feat: true, logo: ['#22c55e', 'L'] },
  { id: 'game-items', name: 'Game Items', game: 'roblox', cat: 'Items', price: 0.5, feat: true, logo: ['#ff7a18', 'MM2'] },
  { id: 'roblox-accounts', name: 'Roblox Accounts', game: 'roblox', cat: 'Accounts', price: 4.99, logo: ['#334155', 'RA'] },
  { id: 'toy-codes', name: 'Toy Codes', game: 'roblox', cat: 'Items', price: 2.99, logo: ['#a855f7', 'TC'] },
  { id: 'vbucks', name: 'V-Bucks', game: 'fortnite', cat: 'Currency', price: 4.49, feat: true, logo: ['#3b82f6', 'V'] },
  { id: 'fortnite-accounts', name: 'Fortnite Accounts', game: 'fortnite', cat: 'Accounts', price: 9.99, logo: ['#6366f1', 'FA'] },
  { id: 'valorant-points', name: 'Valorant Points', game: 'valorant', cat: 'Currency', price: 3.99, feat: true, logo: ['#ff4655', 'VP'] },
  { id: 'valorant-accounts', name: 'Valorant Accounts', game: 'valorant', cat: 'Accounts', price: 7.99, logo: ['#be123c', 'VA'] },
  { id: 'riot-buddy', name: 'Riot Buddy', game: 'valorant', cat: 'Items', price: 1.99, logo: ['#f43f5e', 'RB'] },
]
const GAMES = { roblox: 'Roblox', fortnite: 'Fortnite', valorant: 'Valorant' }
const REVIEWS = [
  ['jxke', 'Got my 10k robux in like 3 minutes, legit.', 'Robux'],
  ['luna.rbx', 'Best rates I have found, staff was super helpful in the ticket.', 'Limiteds'],
  ['tyler_ftn', 'Smooth V-Bucks purchase, will buy again.', 'V-Bucks'],
  ['mxrk', 'Fast delivery on my MM2 set, 10/10.', 'Game Items'],
  ['zayyy', 'Trusted. 5th order now, never had an issue.', 'Robux'],
  ['kira', 'Valorant points arrived instantly. Thanks!', 'Valorant Points'],
]
const money = n => '$' + n.toFixed(2)

function Card({ p, onAdd }) {
  return <div className="pcard" onClick={() => onAdd(p)}>
    <div className="pcard-img">{p.feat && <span className="pcard-feat">HOT</span>}<Logo bg={p.logo[0]} t={p.logo[1]} /></div>
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
  const [hw, setHw] = useState(true)

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])

  const list = useMemo(() => {
    let l = PRODUCTS.filter(p => (!game || p.game === game) && (!cat || p.cat === cat) && p.name.toLowerCase().includes(q.toLowerCase()))
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'name') l = [...l].sort((a, b) => a.name.localeCompare(b.name))
    return l
  }, [game, cat, sort, q])
  const feat = PRODUCTS.filter(p => p.feat)
  const add = p => { setCart(c => [...c, p]); setDrawer(true) }
  const total = cart.reduce((s, p) => s + p.price, 0)

  return <>
    <header id="nav"><div className="wrap">
      <a className="logo" href="#" onClick={() => setGame(null)}><span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent)', display: 'grid', placeItems: 'center', color: '#fff' }}>B</span><span>Bux <span className="grad">Stock</span></span></a>
      <nav className="nav-links">
        <a className={!game ? 'on' : ''} href="#" onClick={() => setGame(null)}>Shop</a>
        {Object.entries(GAMES).map(([k, v]) => <a key={k} className={game === k ? 'on' : ''} href="#" onClick={() => setGame(k)}>{v}</a>)}
        <a href="#">Guides</a>
      </nav>
      <div className="nav-search"><span className="ic"><Ic n="search" s={18} /></span><input placeholder="Search products…" value={q} onChange={e => setQ(e.target.value)} /></div>
      <div className="nav-right">
        <button className="iconbtn lang-btn">EN</button>
        <button className="iconbtn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Ic n={theme === 'dark' ? 'sun' : 'moon'} /></button>
        <button className="iconbtn" onClick={() => setDrawer(true)}><Ic n="cart" />{cart.length > 0 && <span className="cart-badge">{cart.length}</span>}</button>
      </div>
    </div></header>

    <main>
      <section className="hero wrap">
        <div className="statuspill"><span className="dot"></span>Online <span className="eta">· ~5 min delivery</span></div>
        <h1><span className="grad">The Premium Game Marketplace</span></h1>
        <p className="sub">Robux, Limiteds, accounts, V-Bucks &amp; Valorant - the best rates, instant delivery, fulfilled securely through Discord.</p>
        <div className="hero-search"><Ic n="search" /><input placeholder="Search products…" value={q} onChange={e => setQ(e.target.value)} /><button className="btn btn-pri" onClick={() => document.getElementById('allHead').scrollIntoView({ behavior: 'smooth' })}>Search</button></div>
        <div className="trust">
          {[['$3.00', 'Robux / 1K'], ['48,210', 'Orders'], ['4.9★', 'Rating'], ['22,940', 'Members']].map(([n, l]) => <div className="t" key={l}><div className="n">{n}</div><div className="l">{l}</div></div>)}
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
        <div className="frow"><div className="marquee">{[...feat, ...feat, ...feat, ...feat].map((p, i) => <Card key={i} p={p} onAdd={add} />)}</div></div>

        <div className="sec-h" id="allHead"><h2>All products</h2><span className="mut">{list.length} products</span></div>
        <div className="grid">{list.length ? list.map(p => <Card key={p.id} p={p} onAdd={add} />) : <div className="empty" style={{ gridColumn: '1/-1' }}>No products found.</div>}</div>
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
          {REVIEWS.map(([n, b, buy], i) => <div className="vch" key={n}>
            <div className="vch-top"><div className="vch-fb">{n[0].toUpperCase()}</div><div><div className="vch-name">{n}</div><div className="vch-date">{i + 1} day{i ? 's' : ''} ago</div></div><span className="stars" style={{ marginLeft: 'auto' }}>★★★★★</span></div>
            <div className="vch-body">{b}</div><div className="vch-buy">Purchased: {buy}</div>
          </div>)}
        </div>
        <div className="dc-cta">
          <div className="dc-cta-l">
            <h2>Join Our Discord Server</h2>
            <p>Connect with our team, join the community and get exclusive deals, giveaways and updates. Your presence matters - join the excitement today!</p>
            <a className="dc-cta-btn" href="#">Join</a>
          </div>
        </div>
      </section>
    </main>

    <footer id="foot"><div className="wrap">
      <div className="foot-grid">
        <div className="foot-col"><a className="logo" href="#" style={{ marginBottom: 12 }}><span>Bux <span className="grad">Stock</span></span></a>
          <p className="mut" style={{ fontSize: '.88rem', maxWidth: 280 }}>The premium game marketplace - best rates, instant delivery, secured through Discord.</p></div>
        <div className="foot-col"><h4>Shop</h4>{['Robux', 'Limiteds', 'V-Bucks', 'Valorant Points', 'Game Items'].map(x => <a key={x} href="#">{x}</a>)}</div>
        <div className="foot-col"><h4>Help</h4>{['Guides', 'Verified Badge', 'FAQ', 'Terms of Service', 'Privacy Policy', 'Discord'].map(x => <a key={x} href="#">{x}</a>)}</div>
        <div className="foot-col"><h4>Payments</h4><div className="chips">{['Card', 'PayPal', 'Apple Pay', 'Cash App', 'BTC', 'ETH', 'LTC', 'USDT'].map(x => <span key={x} className="chip">{x}</span>)}</div></div>
      </div>
      <div className="foot-bottom"><span>© {new Date().getFullYear()} Bux Stock. All rights reserved.</span><span>Not affiliated with Roblox, Epic Games or Riot Games.</span></div>
    </div></footer>

    <div className={'drawer-bg' + (drawer ? ' on' : '')} onClick={() => setDrawer(false)} />
    <aside className={'drawer' + (drawer ? ' on' : '')}>
      <div className="drawer-h"><h3>Your Cart</h3><button className="iconbtn" onClick={() => setDrawer(false)}><Ic n="x" /></button></div>
      <div className="drawer-items">{cart.length ? cart.map((p, i) => <div className="ci" key={i}><div style={{ width: 52, height: 52, borderRadius: 10, background: p.logo[0], color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>{p.logo[1]}</div><div><div className="ci-n">{p.name}</div><div className="ci-p">{money(p.price)}</div></div><div className="ci-right"><span className="ci-rm" onClick={() => setCart(c => c.filter((_, j) => j !== i))}>Remove</span></div></div>) : <div className="empty">Your cart is empty</div>}</div>
      {cart.length > 0 && <div className="drawer-foot"><div className="drawer-sub"><span>Subtotal</span><b>{money(total)}</b></div><button className="btn btn-pri btn-lg">Checkout</button></div>}
    </aside>

    <div className={'modal-bg' + (hw ? ' on' : '')} onClick={e => e.target === e.currentTarget && setHw(false)}>
      <div className="hw-modal">
        <button className="modal-x" onClick={() => setHw(false)}>✕</button>
        <div className="hw-pump">🎃</div>
        <div><span className="hw-chip">Halloween drop · limited time</span></div>
        <h2>Spooky season is here</h2>
        <p className="hw-sub">New <b>MM2 Halloween items</b> just landed - plus a <b>Headless deal</b> on 31K Robux. Grab them before the season's gone!</p>
        <button className="btn btn-pri btn-lg hw-cta" onClick={() => setHw(false)}>🎃 Shop the Halloween drop</button>
        <button className="hw-later" onClick={() => setHw(false)}>Maybe later</button>
      </div>
    </div>

    <button className={'chat-fab' + (chat ? ' hide' : '')} onClick={() => setChat(true)}><Ic n="chat" s={26} /></button>
    <div className={'chat-panel' + (chat ? ' on' : '')}>
      <div className="chat-head"><div className="chat-head-l"><span className="chat-avatar"><Ic n="chat" /></span><div><div className="chat-title">Bux Support</div><div className="chat-status"><span className="chat-dot"></span>Typically replies in minutes</div></div></div>
        <button className="chat-icbtn" onClick={() => setChat(false)}><Ic n="x" /></button></div>
      <div className="chat-msgs"><div className="chat-msg bot">Hi! 👋 How can I help you today?</div></div>
      <form className="chat-input" onSubmit={e => e.preventDefault()}><input placeholder="Ask about products, delivery, payments…" /><button className="chat-send" type="submit"><Ic n="chat" /></button></form>
    </div>
  </>
}
