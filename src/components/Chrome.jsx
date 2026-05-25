// src/components/Chrome.jsx
// Sidebar, Topbar, SearchModal, SettingsModal, EditToolbar, LoggedOutScreen

import { useState, useEffect, useRef, useMemo, Fragment } from 'react'
import { Avatar, BrandMark, BRAND_NAME, useToast } from './Atoms'
import {
  IconSearch, IconSidebar, IconSun, IconMoon, IconChevD, IconChevR,
  IconPlus, IconCheck, IconX, IconEdit, IconEye, IconSparkle, IconLayers,
  IconSettings, IconLogout, IconCamera,
} from './Icons'

export const NAV_TREE = [
  { id: 'overview', label: 'Overview da Marca', children: [
    { id: 'overview/visao', label: 'Visão Geral' },
    { id: 'overview/existe', label: 'Por que a marca existe' },
    { id: 'overview/bandeiras', label: 'Bandeiras da Marca' },
  ]},
  { id: 'nucleo', label: 'Núcleo da Marca', children: [
    { id: 'nucleo/posicionamento', label: 'Posicionamento' },
    { id: 'nucleo/visao', label: 'Visão e Propósito' },
    { id: 'nucleo/arquetipos', label: 'Arquétipos' },
    { id: 'nucleo/publico', label: 'Público-Alvo' },
    { id: 'nucleo/arquitetura', label: 'Arquitetura de Marca' },
  ]},
  { id: 'verbal', label: 'Universo Verbal', children: [
    { id: 'verbal/manifesto', label: 'Manifesto' },
    { id: 'verbal/tom', label: 'Tom de Voz' },
    { id: 'verbal/vocabulario', label: 'Vocabulário' },
    { id: 'verbal/territorios', label: 'Territórios de Palavras' },
  ]},
  { id: 'visual', label: 'Universo Visual', children: [
    { id: 'visual/logotipo', label: 'Logotipo' },
    { id: 'visual/cores', label: 'Guia de Cores' },
    { id: 'visual/tipografia', label: 'Tipografia' },
    { id: 'visual/grafismos', label: 'Grafismos' },
    { id: 'visual/iconografia', label: 'Iconografia' },
    { id: 'visual/foto', label: 'Estilo Fotográfico' },
  ]},
  { id: 'aplicacoes', label: 'Aplicações', children: [
    { id: 'aplicacoes/papelaria', label: 'Papelaria Institucional' },
    { id: 'aplicacoes/digital', label: 'Presença Digital' },
  ]},
]

/* ─── UserMenu ─── */
function UserMenu({ user, onOpenSettings, onLogout, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [onClose])
  return (
    <div ref={ref} className="user-menu" role="menu">
      <div className="user-menu-head">
        <Avatar user={user} size={32} />
        <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--fg-primary)', lineHeight: 1.2 }}>{user.name}</div>
      </div>
      <div className="user-menu-sep" />
      <button className="user-menu-item" onClick={() => { onOpenSettings(); onClose() }}>
        <IconSettings size={14} /><span>Configurações</span>
      </button>
      <button className="user-menu-item" onClick={() => { onLogout(); onClose() }}>
        <IconLogout size={14} /><span>Desconectar</span>
      </button>
    </div>
  )
}

/* ─── Sidebar ─── */
export function Sidebar({ route, onNavigate, onCollapse, onOpenSearch, user, onOpenSettings, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const sectionOf = (r) => NAV_TREE.find((s) => r === s.id || r.startsWith(s.id + '/'))?.id
  const [open, setOpen] = useState(() => ({ [sectionOf(route) || NAV_TREE[0].id]: true }))
  const scrollRef = useRef(null)

  useEffect(() => {
    const id = sectionOf(route)
    if (id) setOpen({ [id]: true })
  }, [route])

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const active = root.querySelector('.sb-sub button.active')
    if (!active) return
    const r = root.getBoundingClientRect()
    const a = active.getBoundingClientRect()
    if (a.top < r.top + 12 || a.bottom > r.bottom - 12)
      root.scrollTop += (a.top - r.top) - r.height / 2 + a.height / 2
  }, [route])

  const toggleSection = (id) => setOpen((o) => (o[id] ? {} : { [id]: true }))

  return (
    <aside className="app-sidebar">
      <div className="sb-pad">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <BrandMark size={24} />
          <button className="btn-ghost" onClick={onCollapse} style={{ padding: 7, border: 'none', background: 'transparent' }}>
            <IconSidebar size={18} />
          </button>
        </div>
        <button onClick={onOpenSearch} style={{ width: '100%', height: 40, borderRadius: 5, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', textAlign: 'left', fontSize: 13, fontWeight: 500 }}>
          <IconSearch size={13} /><span style={{ flex: 1 }}>Buscar</span>
          <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 10, opacity: 0.5 }}>⌘K</span>
        </button>
      </div>

      <div className="sb-scroll" ref={scrollRef}>
        {NAV_TREE.map((section, si) => {
          const isOpen = !!open[section.id]
          const isInPath = route === section.id || route.startsWith(section.id + '/')
          return (
            <Fragment key={section.id}>
              {si === 1 && <div className="sb-divider" />}
              <button
                className={`sb-row${isOpen ? ' open' : ''}${isInPath ? ' active' : ''}`}
                aria-expanded={isOpen}
                onClick={() => toggleSection(section.id)}>
                <span>{section.label}</span>
                <span className="chev"><IconChevD size={13} /></span>
              </button>
              {isOpen && (
                <div className="sb-sub">
                  {section.children.map((c) => (
                    <button key={c.id} onClick={() => onNavigate(c.id)} className={route === c.id ? 'active' : ''}>
                      <span className="dot" />{c.label}
                    </button>
                  ))}
                </div>
              )}
            </Fragment>
          )
        })}
      </div>

      <div style={{ padding: '16px 24px 24px', borderTop: '1px solid var(--border-hairline)', position: 'relative' }}>
        {menuOpen && (
          <UserMenu user={user} onOpenSettings={onOpenSettings} onLogout={onLogout} onClose={() => setMenuOpen(false)} />
        )}
        <button className={`user-tile${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen((o) => !o)} aria-haspopup="menu" aria-expanded={menuOpen}>
          <Avatar user={user} size={34} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1, color: 'var(--fg-primary)' }}>{user.name}</div>
            <div style={{ fontWeight: 500, fontSize: 9.5, lineHeight: 1.2, color: 'var(--fg-muted)' }}>{user.role}</div>
          </div>
          <span className="user-tile-chev"><IconChevD size={11} /></span>
        </button>
      </div>
    </aside>
  )
}

/* ─── Topbar ─── */
export function Topbar({ mode, onMode, theme, onTheme, breadcrumb }) {
  return (
    <header className="app-topbar">
      <div className="app-breadcrumb">
        {breadcrumb.map((b, i) => {
          const isLast = i === breadcrumb.length - 1
          return (
            <Fragment key={i}>
              {i > 0 && <span className="sep">/</span>}
              <span className={`crumb${isLast ? ' current' : ''}`}>{b}</span>
            </Fragment>
          )
        })}
      </div>
      <div className="topbar-actions">
        <div style={{ display: 'flex', padding: 3, borderRadius: 8, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)' }}>
          {[{ id: 'view', label: 'Visualizar', icon: IconEye }, { id: 'edit', label: 'Editar', icon: IconEdit }].map((m) => {
            const M = m.icon
            const active = mode === m.id
            return (
              <button key={m.id} onClick={() => onMode(m.id)} style={{ padding: '7px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: active ? 'var(--color-ink-100)' : 'transparent', color: active ? 'var(--color-ink-900)' : 'var(--fg-muted)', fontSize: 11.5, fontWeight: 600, letterSpacing: 0.03, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 120ms' }}>
                <M size={12} />{m.label}
              </button>
            )
          })}
        </div>
        <div style={{ width: 1, height: 22, background: 'var(--border-hairline)' }} />
        <button className="btn-ghost" style={{ padding: 8, border: 'none' }} onClick={onTheme}>
          {theme === 'dark' ? <IconSun size={15} /> : <IconMoon size={15} />}
        </button>
      </div>
    </header>
  )
}

/* ─── SearchModal ─── */
const QUICK_ANSWERS = [
  { q: 'Quais são as regras para patrocínios?', answer: 'Patrocínios seguem a hierarquia da Arquitetura de Marca — o LOGOTIPO sempre aparece à esquerda, em ≥1,5x a altura do parceiro.', cites: [{ label: 'Logotipo · Co-branding', route: 'visual/logotipo' }, { label: 'Arquitetura de Marca', route: 'nucleo/arquitetura' }] },
  { q: 'Onde baixo o logotipo em SVG?', answer: 'Vá em Universo Visual › Logotipo, seção Arquivos. Cada variante tem botão de download em SVG, PNG e PDF.', cites: [{ label: 'Logotipo · Arquivos', route: 'visual/logotipo' }] },
  { q: 'Qual é o tom de voz em peças formais?', answer: 'Em peças institucionais, o tom é direto, calmo — sem exclamações nem emoji. Frases curtas, verbo no imperativo.', cites: [{ label: 'Tom de Voz', route: 'verbal/tom' }] },
]

export function SearchModal({ onClose, onNavigate }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const flat = useMemo(() => {
    const arr = []
    NAV_TREE.forEach((s) => s.children.forEach((c) => arr.push({ ...c, section: s.label })))
    return arr
  }, [])

  const filtered = query
    ? flat.filter((it) => (it.label + it.section).toLowerCase().includes(query.toLowerCase()))
    : flat.slice(0, 6)

  const matchedAnswer = QUICK_ANSWERS.find((a) => query && a.q.toLowerCase().includes(query.toLowerCase().slice(0, 12)))
  const go = (route) => { onNavigate(route); onClose() }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-head">
          <IconSparkle size={16} color="var(--color-accent-sky)" />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pergunte qualquer coisa — ex: 'regras para patrocínios?'" />
          <span className="kbd">esc</span>
        </div>
        <div className="search-modal-body">
          {(matchedAnswer || (query.length > 4 && query.endsWith('?'))) && (
            <div className="search-ai-card">
              <div className="label"><IconSparkle size={11} /> Assistente IA · respondendo sobre {BRAND_NAME}</div>
              <div className="answer">
                {matchedAnswer
                  ? <>{matchedAnswer.answer}{' '}{matchedAnswer.cites.map((c, i) => <a key={i} className="cite" onClick={() => go(c.route)}>[{i + 1}]</a>)}</>
                  : <span style={{ opacity: 0.7 }}>Pensando…</span>
                }
              </div>
              {matchedAnswer && (
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {matchedAnswer.cites.map((c, i) => <button key={i} className="btn-pill" onClick={() => go(c.route)}>[{i + 1}] {c.label} →</button>)}
                </div>
              )}
            </div>
          )}
          {!query && (
            <>
              <div className="search-section-label">Sugestões</div>
              {QUICK_ANSWERS.map((a, i) => (
                <div key={i} className="search-result" onClick={() => setQuery(a.q)}>
                  <IconSparkle size={13} color="var(--color-accent-sky)" />
                  <div style={{ flex: 1 }}>
                    <div className="search-result-title">{a.q}</div>
                    <div className="search-result-path">Pergunte ao Assistente</div>
                  </div>
                </div>
              ))}
            </>
          )}
          <div className="search-section-label">Páginas {query && `· ${filtered.length} resultados`}</div>
          {filtered.length === 0 && <div style={{ padding: '20px 22px', color: 'var(--fg-muted)', fontSize: 13 }}>Nenhuma página encontrada para "{query}".</div>}
          {filtered.map((it) => (
            <div key={it.id} className="search-result" onClick={() => go(it.id)}>
              <IconLayers size={13} color="var(--fg-muted)" />
              <div style={{ flex: 1 }}>
                <div className="search-result-title">{it.label}</div>
                <div className="search-result-path">{it.section}</div>
              </div>
              <span className="kbd">↵</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── EditToolbar ─── */
export function EditToolbar({ visible }) {
  const { show } = useToast()
  if (!visible) return null
  const blocks = [{ id: 'texto', label: 'Texto' }, { id: 'cor', label: 'Cor' }, { id: 'tipo', label: 'Tipografia' }, { id: 'midia', label: 'Mídia' }, { id: 'embed', label: 'Embed' }, { id: 'download', label: 'Download' }]
  return (
    <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 4, background: '#141414', border: '1px solid var(--border-hairline)', borderRadius: 999, padding: 6, zIndex: 50 }}>
      <div style={{ padding: '0 10px 0 14px', fontSize: 10.5, fontWeight: 600, letterSpacing: 0.1, textTransform: 'uppercase', color: 'var(--color-accent-sky)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent-sky)' }} />Edição
      </div>
      <div style={{ width: 1, height: 18, background: 'var(--border-hairline)' }} />
      {blocks.map((b) => <button key={b.id} className="btn-pill"><IconPlus size={10} />{b.label}</button>)}
      <div style={{ width: 1, height: 18, background: 'var(--border-hairline)' }} />
      <button className="btn-pill" style={{ background: 'var(--color-ink-100)', color: 'var(--color-ink-900)' }} onClick={() => show('Salvo com sucesso.')}>
        <IconCheck size={11} />Salvar
      </button>
    </div>
  )
}

/* ─── SettingsModal ─── */
export function SettingsModal({ user, onSave, onClose }) {
  const [first, setFirst] = useState(user.firstName || user.name.split(' ')[0] || '')
  const [last, setLast]   = useState(user.lastName  || user.name.split(' ').slice(1).join(' ') || '')
  const [photo, setPhoto] = useState(user.photo || null)
  const fileRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result)
    reader.readAsDataURL(f)
  }

  const submit = () => {
    const name = [first.trim(), last.trim()].filter(Boolean).join(' ') || user.name
    onSave({ ...user, firstName: first.trim(), lastName: last.trim(), name, initial: (first.trim()[0] || user.initial).toUpperCase(), photo })
    onClose()
  }

  const preview = { ...user, name: [first, last].filter(Boolean).join(' ') || user.name, initial: (first[0] || user.initial).toUpperCase(), photo }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-head">
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 4 }}>Configurações</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Edite suas informações de perfil</div>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: 6, border: 'none' }}><IconX size={14} /></button>
        </div>
        <div className="settings-body">
          <div className="settings-photo-row">
            <div className="settings-photo-wrap">
              <Avatar user={preview} size={72} />
              <button type="button" className="settings-photo-edit" onClick={() => fileRef.current?.click()}><IconCamera size={13} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button type="button" className="btn-pill" onClick={() => fileRef.current?.click()}><IconCamera size={11} />{photo ? 'Trocar foto' : 'Carregar foto'}</button>
              {photo && <button type="button" className="btn-pill" onClick={() => setPhoto(null)} style={{ color: 'var(--fg-muted)' }}>Remover</button>}
              <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
            </div>
          </div>
          <div className="settings-fields">
            <label className="settings-field">
              <span className="settings-label">Nome</span>
              <input className="settings-input" value={first} onChange={(e) => setFirst(e.target.value)} placeholder="Ana" />
            </label>
            <label className="settings-field">
              <span className="settings-label">Sobrenome</span>
              <input className="settings-input" value={last} onChange={(e) => setLast(e.target.value)} placeholder="Ribeiro" />
            </label>
          </div>
          <label className="settings-field">
            <span className="settings-label">Cargo</span>
            <input className="settings-input" value={user.role} disabled style={{ opacity: 0.55, cursor: 'not-allowed' }} />
            <span style={{ fontSize: 10.5, color: 'var(--fg-muted)', marginTop: 2 }}>Definido pelo administrador da marca.</span>
          </label>
          <div className="settings-actions">
            <button type="button" className="btn-pill" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn-cta-sm" onClick={submit}>Salvar alterações</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── LoggedOutScreen ─── */
export function LoggedOutScreen({ user, onReturn }) {
  return (
    <div className="logged-out">
      <div className="logged-out-card">
        <BrandMark size={22} />
        <div style={{ height: 1, background: 'var(--border-hairline)', margin: '20px 0' }} />
        <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--fg-primary)', marginBottom: 8, letterSpacing: -0.2 }}>Sessão encerrada</div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 24, lineHeight: 1.45 }}>
          {user.firstName || user.name.split(' ')[0]}, você saiu do sistema de diretrizes da marca.
        </div>
        <button className="btn-cta" onClick={onReturn} style={{ width: '100%' }}>Entrar novamente</button>
      </div>
    </div>
  )
}
