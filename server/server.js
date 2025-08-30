import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = Number(process.env.PORT || 8787)

// CORS
const whitelist = (process.env.CORS_WHITELIST || '').split(',').map(s=>s.trim()).filter(Boolean)
const corsOptions = {
  origin: function (origin, cb) {
    if (!origin) return cb(null, true)
    if (whitelist.length === 0) return cb(null, true)
    if (whitelist.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS: ' + origin))
  },
  credentials: process.env.CORS_ALLOW_CREDENTIALS === 'true'
}

// Security & parsing
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))
app.use(cors(corsOptions))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))

// Rate limit
const limiter = rateLimit({ windowMs: 60_000, max: 60 })
app.use('/api/', limiter)

// Simple file store for appointments (demo)
const DATA_DIR = path.join(__dirname, 'data')
const APPTS_FILE = path.join(DATA_DIR, 'appointments.json')
function ensureData(){ if(!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); if(!fs.existsSync(APPTS_FILE)) fs.writeFileSync(APPTS_FILE, JSON.stringify({items:[]}, null, 2)) }
function loadAppts(){ ensureData(); return JSON.parse(fs.readFileSync(APPTS_FILE, 'utf8')) }
function saveAppts(db){ ensureData(); fs.writeFileSync(APPTS_FILE, JSON.stringify(db, null, 2)) }

// Helpers
function requireFields(obj, keys){
  const missing = keys.filter(k => !(k in obj) || obj[k] === undefined || obj[k] === null || String(obj[k]).trim() === '')
  return { ok: missing.length === 0, missing }
}

function makeTransport(){
  const host = process.env.SMTP_HOST
  if(!host){
    // dev fallback: just log emails
    return nodemailer.createTransport({ jsonTransport: true })
  }
  return nodemailer.createTransport({
    host: host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })
}

app.get('/api/health', (req, res)=> res.json({ status: 'ok' }))

app.post('/api/contact', async (req, res)=>{
  const body = req.body || {}
  const reqd = ['name','email','message']
  const vf = requireFields(body, reqd)
  if(!vf.ok) return res.status(400).json({ error: 'missing_fields', missing: vf.missing })
  try{
    const transporter = makeTransport()
    const from = process.env.SMTP_FROM || 'no-reply@localhost'
    const out = await transporter.sendMail({
      from,
      to: process.env.CONTACT_TO || 'owner@localhost',
      subject: `Website contact from ${body.name}`,
      text: `From: ${body.name} <${body.email}>
Phone: ${body.phone||''}

${body.message}`
    })
    res.json({ ok: true, queued: !!out })
  } catch (e){
    console.warn('contact email failed', e)
    res.status(500).json({ ok:false, error: 'email_failed' })
  }
})

app.post('/api/appointment', async (req, res)=>{
  const body = req.body || {}
  const vf = requireFields(body, ['name','email','datetime'])
  if(!vf.ok) return res.status(400).json({ error: 'missing_fields', missing: vf.missing })
  const db = loadAppts()
  const id = String(Date.now())
  const item = { id, ...body, status: 'pending', createdAt: new Date().toISOString() }
  db.items.push(item); saveAppts(db)

  try{
    const base = process.env.PUBLIC_URL || `http://localhost:${PORT}`
    const key = encodeURIComponent(process.env.APPOINTMENT_ADMIN_KEY || 'dev-admin-key')
    const confirmUrl = `${base}/api/appointment/${id}/confirm?key=${key}`
    const declineUrl = `${base}/api/appointment/${id}/decline?key=${key}`
    const transporter = makeTransport()
    const from = process.env.SMTP_FROM || 'no-reply@localhost'
    await transporter.sendMail({
      from,
      to: process.env.APPOINTMENT_TO || 'owner@localhost',
      subject: `New appointment request from ${body.name}`,
      text: `When: ${body.datetime}
Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone||''}

Approve: ${confirmUrl}
Decline: ${declineUrl}`
    })
  }catch(e){
    console.warn('notify admin failed', e)
  }
  res.json({ ok:true, id })
})

app.get('/api/appointment/:id/confirm', (req, res)=>{
  const { id } = req.params
  const { key } = req.query
  if(String(key) !== String(process.env.APPOINTMENT_ADMIN_KEY || 'dev-admin-key')) return res.status(403).json({ error: 'forbidden' })
  const db = loadAppts()
  const item = db.items.find(i=> i.id === id)
  if(!item) return res.status(404).json({ error:'not_found' })
  item.status = 'confirmed'; saveAppts(db)
  res.json({ ok:true, item })
})

app.get('/api/appointment/:id/decline', (req, res)=>{
  const { id } = req.params
  const { key } = req.query
  if(String(key) !== String(process.env.APPOINTMENT_ADMIN_KEY || 'dev-admin-key')) return res.status(403).json({ error: 'forbidden' })
  const db = loadAppts()
  const item = db.items.find(i=> i.id === id)
  if(!item) return res.status(404).json({ error:'not_found' })
  item.status = 'declined'; saveAppts(db)
  res.json({ ok:true, item })
})

// optional demo upload
const upload = multer({ dest: path.join(__dirname, 'uploads') })
app.post('/api/upload', upload.single('file'), (req, res)=>{
  res.json({ ok:true, file: req.file })
})

app.listen(PORT, ()=> {
  console.log(`API listening on http://localhost:${PORT}`)
})
