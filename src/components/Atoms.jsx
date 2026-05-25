// src/components/Atoms.jsx
// BrandMark, Toast, Tag, Banner, Block, InsertRail, SectionLabel,
// PageHeader, Embed, ImgSlot, ColorSwatch, DownloadRow, Avatar

import { useState, useContext, useCallback, useRef, createContext } from 'react'
import { IconGripV, IconPlus, IconImage, IconPlay, IconFigma, IconLink, IconLayers, IconDownload } from './Icons'

export const BRAND_NAME = 'LOGOTIPO'

/* ─── BrandMark ─── */
export function BrandMark({ size = 26, color = 'currentColor', style }) {
  return (
    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: size, letterSpacing: 0, lineHeight: 1, color, ...style }}>
      {BRAND_NAME}
    </span>
  )
}

/* ─── Toast ─── */
export const ToastCtx = createContext({ show: () => {} })

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null)
  const timer = useRef(null)
  const show = useCallback((m) => {
    setMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(null), 1800)
  }, [])
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      {msg && <div className="copy-toast">{msg}</div>}
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)

/* ─── Tag ─── */
export function Tag({ children, variant }) {
  return <span className={`tag${variant ? ` tag-${variant}` : ''}`}>{children}</span>
}

/* ─── Banner ─── */
export function Banner({ icon, text, action }) {
  return (
    <div className="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {icon}
        <div className="banner-text">{text}</div>
      </div>
      {action}
    </div>
  )
}

/* ─── Block ─── */
export function Block({ children, type = 'texto' }) {
  return (
    <div className="block">
      <div className="block-controls">
        <button className="btn-ghost" title="Arrastar" style={{ padding: 6 }}><IconGripV size={14} /></button>
        <button className="btn-ghost" style={{ padding: 6, fontSize: 9, letterSpacing: 0.08, textTransform: 'uppercase' }}>{type}</button>
      </div>
      {children}
    </div>
  )
}

export function InsertRail() {
  return (
    <div className="insert-rail">
      <button><IconPlus size={10} /> adicionar bloco</button>
    </div>
  )
}

/* ─── SectionLabel ─── */
export function SectionLabel({ idx, children }) {
  return (
    <div className="page-section-label">
      <span className="idx">{idx}</span>
      <span>{children}</span>
    </div>
  )
}

/* ─── PageHeader ─── */
export function PageHeader({ eyebrow, title, lede, meta, tags }) {
  return (
    <>
      <div className="page-header-row">
        <div className="page-eyebrow">{eyebrow}</div>
        {tags && tags.map((t, i) => <Tag key={i} variant={t.variant}>{t.label}</Tag>)}
      </div>
      <h1 className="page-title">{title}</h1>
      {lede && <p className="page-lede">{lede}</p>}
      {meta && (
        <dl className="page-meta">
          {meta.map((m, i) => (
            <div key={i}><dt>{m.label}:</dt><dd>{m.value}</dd></div>
          ))}
        </dl>
      )}
    </>
  )
}

/* ─── Embed ─── */
export function Embed({ kind = 'Figma', title, children }) {
  const icons = { Figma: IconFigma, Vídeo: IconPlay, Miro: IconLayers, Drive: IconImage }
  const KindIcon = icons[kind] || IconLink
  return (
    <div className="embed">
      <div className="embed-head">
        <div className="embed-head-meta">
          <KindIcon size={14} color="var(--color-accent-sky)" />
          <strong>{title}</strong>
          <span>· {kind}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-pill" style={{ padding: '5px 10px', fontSize: 10 }}>Abrir</button>
        </div>
      </div>
      <div className="embed-body">{children}</div>
    </div>
  )
}

/* ─── ImgSlot ─── */
export function ImgSlot({ label, aspect = '1', style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: aspect, background: 'var(--bg-surface)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 8, ...style }}>
      <div style={{ textAlign: 'center', color: 'var(--fg-muted)', padding: 16 }}>
        <IconImage size={22} color="var(--fg-muted)" />
        <div style={{ fontSize: 11, marginTop: 8, maxWidth: '24ch', lineHeight: 1.4 }}>{label}</div>
      </div>
    </div>
  )
}

/* ─── ColorSwatch ─── */
export function ColorSwatch({ name, hex, rgb, cmyk, pantone }) {
  const { show } = useToast()
  const [hoverCode, setHoverCode] = useState(null)
  const isLight = (parseInt(hex.slice(1, 3), 16) + parseInt(hex.slice(3, 5), 16) + parseInt(hex.slice(5, 7), 16)) / 3 > 160

  return (
    <div className="swatch" onClick={() => { navigator.clipboard?.writeText(hex); show(`HEX copiado · ${hex}`) }}>
      <div className="swatch-fill" style={{ background: hex, color: isLight ? '#010511' : '#FFFFFF' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 0.1, textTransform: 'uppercase', opacity: 0.7 }}>{name}</div>
          <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, opacity: 0.75 }}>{hex}</div>
        </div>
      </div>
      <div className="swatch-meta" onClick={(e) => e.stopPropagation()}>
        <div className="swatch-name">{name}</div>
        <div className="swatch-hex">{hex}</div>
        <dl className="swatch-codes">
          {[['HEX', hex], ['RGB', rgb], ['CMYK', cmyk], ['PMS', pantone]].filter(([, v]) => v).map(([k, v]) => (
            <>
              <dt key={`dt-${k}`}>{k}</dt>
              <dd key={`dd-${k}`}
                onClick={() => { navigator.clipboard?.writeText(v); show(`${k} copiado · ${v}`) }}
                onMouseEnter={() => setHoverCode(k)}
                onMouseLeave={() => setHoverCode(null)}
                style={{ cursor: 'pointer', color: hoverCode === k ? 'var(--fg-primary)' : undefined }}>
                {v}
              </dd>
            </>
          ))}
        </dl>
      </div>
    </div>
  )
}

/* ─── DownloadRow ─── */
export function DownloadRow({ title, sub, formats = ['SVG', 'PNG', 'PDF'], thumb }) {
  const { show } = useToast()
  return (
    <div className="dl-row">
      <div className="dl-row-meta">
        <div className="dl-row-thumb">{thumb || <IconImage size={18} color="var(--fg-muted)" />}</div>
        <div>
          <div className="dl-row-title">{title}</div>
          {sub && <div className="dl-row-sub">{sub}</div>}
        </div>
      </div>
      <div className="dl-formats">
        {formats.map(f => (
          <button key={f} className="dl-format" onClick={() => show(`Baixando ${title}.${f.toLowerCase()}`)}>
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Avatar ─── */
export function Avatar({ user, size = 34 }) {
  const common = { width: size, height: size, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }
  if (user.photo) return <img src={user.photo} alt="" style={{ ...common, objectFit: 'cover' }} />
  return (
    <div style={{ ...common, background: 'var(--color-ink-0)', color: 'var(--color-ink-900)', fontWeight: 600, fontSize: size * 0.4 }}>
      {user.initial}
    </div>
  )
}
