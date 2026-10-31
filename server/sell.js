// Server-only handler for POST /api/sell. The webhook URL lives in .env
// (SELL_WEBHOOK_URL) and never reaches the browser bundle.
const TYPES = {
  group: 'Roblox Group',
  items: 'In-Game Items',
  limiteds: 'Roblox Limiteds',
  funds: 'Group Funds',
  account: 'Roblox Account',
}
const hits = new Map()
const clip = (v, n = 300) => String(v ?? '').trim().slice(0, n)

function validate(b) {
  if (!TYPES[b.type]) return 'Pick what you are selling'
  if (!/^[a-z0-9_.]{2,32}$/i.test(clip(b.discord, 40))) return 'Enter a valid Discord username'
  if (!clip(b.details, 1500)) return 'Add some details'
  if (b.price !== '' && b.price != null && !(Number(b.price) >= 0)) return 'Asking price must be a number'
  if (b.type === 'account') {
    if (!(Number(b.robux) >= 1000)) return 'Accounts must have at least 1,000 Robux'
    if (!(Number(b.limiteds) >= 1)) return 'Accounts must have at least 1 limited'
  }
  if (b.type === 'funds' && !(Number(b.amount) > 0)) return 'Enter the amount of group funds'
  return null
}

export async function handleSell(req, res, webhook) {
  const send = (code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)) }
  if (req.method !== 'POST') return send(405, { error: 'Method not allowed' })
  const ip = req.socket.remoteAddress || 'x'
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 10 * 60e3)
  if (list.length >= 5) return send(429, { error: 'Too many requests - try again in a few minutes' })
  let raw = ''
  for await (const c of req) { raw += c; if (raw.length > 20000) return send(413, { error: 'Too large' }) }
  let b; try { b = JSON.parse(raw) } catch { return send(400, { error: 'Bad request' }) }
  const err = validate(b); if (err) return send(400, { error: err })
  if (!webhook) return send(500, { error: 'Selling is not configured' })
  list.push(now); hits.set(ip, list)

  const fields = [
    ['Type', TYPES[b.type]], ['Discord', clip(b.discord, 40)], ['Roblox username', clip(b.roblox, 40)],
    ['Link', clip(b.link, 300)], ['Robux on account', b.type === 'account' ? Number(b.robux).toLocaleString() : ''],
    ['Limiteds on account', b.type === 'account' ? String(Number(b.limiteds)) : ''], ['Group funds', b.type === 'funds' ? Number(b.amount).toLocaleString() + ' R$' : ''],
    ['Members', clip(b.members, 20)], ['Game', clip(b.game, 60)], ['Asking price', b.price ? '$' + Number(b.price).toFixed(2) : 'Open to offers'],
  ].filter(f => f[1]).map(([name, value]) => ({ name, value: value.replace(/@/g, '@\u200b'), inline: true }))

  const r = await fetch(webhook, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Saint Services - Sell Requests', allowed_mentions: { parse: [] },
      embeds: [{ title: `New sell request: ${TYPES[b.type]}`, color: 0x7c3aed, fields, description: clip(b.details, 1500).replace(/@/g, '@\u200b'), timestamp: new Date().toISOString() }],
    }),
  }).catch(() => null)
  if (!r || !r.ok) return send(502, { error: 'Could not send request, try again' })
  send(200, { ok: true })
}
