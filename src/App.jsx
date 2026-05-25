// src/App.jsx
import { useState, useEffect, useRef, useMemo } from 'react'
import { ToastProvider, BRAND_NAME } from './components/Atoms'
import { Sidebar, Topbar, SearchModal, EditToolbar, SettingsModal, LoggedOutScreen, NAV_TREE } from './components/Chrome'
import { IconSidebar } from './components/Icons'

import { PageVisaoGeral, PagePorQueExiste, PageBandeiras } from './pages/Overview'
import { PagePosicionamento, PageVisaoProposito, PageArquetipos, PagePublico, PageArquitetura } from './pages/Nucleo'
import { PageManifesto, PageTomDeVoz, PageVocabulario, PageTerritorios } from './pages/Verbal'
import { PageLogotipo, PageCores, PageTipografia, PageGrafismos, PageIconografia, PageFotografia } from './pages/Visual'
import { PagePapelaria, PageDigital } from './pages/Aplicacoes'

const ROUTES = {
  'overview/visao':          (nav) => <PageVisaoGeral nav={nav} />,
  'overview/existe':         ()    => <PagePorQueExiste />,
  'overview/bandeiras':      ()    => <PageBandeiras />,
  'nucleo/posicionamento':   (nav) => <PagePosicionamento nav={nav} />,
  'nucleo/visao':            ()    => <PageVisaoProposito />,
  'nucleo/arquetipos':       ()    => <PageArquetipos />,
  'nucleo/publico':          ()    => <PagePublico />,
  'nucleo/arquitetura':      ()    => <PageArquitetura />,
  'verbal/manifesto':        ()    => <PageManifesto />,
  'verbal/tom':              ()    => <PageTomDeVoz />,
  'verbal/vocabulario':      ()    => <PageVocabulario />,
  'verbal/territorios':      ()    => <PageTerritorios />,
  'visual/logotipo':         ()    => <PageLogotipo />,
  'visual/cores':            ()    => <PageCores />,
  'visual/tipografia':       ()    => <PageTipografia />,
  'visual/grafismos':        ()    => <PageGrafismos />,
  'visual/iconografia':      ()    => <PageIconografia />,
  'visual/foto':             ()    => <PageFotografia />,
  'aplicacoes/papelaria':    ()    => <PagePapelaria />,
  'aplicacoes/digital':      ()    => <PageDigital />,
}

export default function App() {
  const [route, setRoute]               = useState('overview/visao')
  const [mode, setMode]                 = useState('view')
  const [theme, setTheme]               = useState('dark')
  const [searchOpen, setSearchOpen]     = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loggedOut, setLoggedOut]       = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [user, setUser] = useState({
    firstName: 'Ana', lastName: 'Ribeiro', name: 'Ana Ribeiro',
    role: 'Brand Lead · Estúdio', initial: 'A', photo: null,
  })
  const mainRef = useRef(null)

  // Theme class on <html>
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('theme-switching')
    html.classList.toggle('light-mode', theme === 'light')
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => html.classList.remove('theme-switching'))
    )
    return () => cancelAnimationFrame(id)
  }, [theme])

  // Scroll to top on route change
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [route])

  // ⌘K shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((s) => !s)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const breadcrumb = useMemo(() => {
    const [secId] = route.split('/')
    const sec  = NAV_TREE.find((s) => s.id === secId)
    const page = sec?.children.find((c) => c.id === route)
    return ['Diretriz', BRAND_NAME, sec?.label, page?.label].filter(Boolean)
  }, [route])

  const pageContent = ROUTES[route]
    ? ROUTES[route](setRoute)
    : ROUTES['overview/visao'](setRoute)

  return (
    <ToastProvider>
      <div className={[
        'app-root',
        mode === 'edit' ? 'edit-mode' : '',
        sidebarHidden ? 'sidebar-hidden' : '',
      ].filter(Boolean).join(' ')}>

        <Sidebar
          route={route}
          onNavigate={setRoute}
          onCollapse={() => setSidebarHidden(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onLogout={() => setLoggedOut(true)}
          user={user}
        />

        <button
          className="sidebar-reveal"
          onClick={() => setSidebarHidden(false)}
          aria-label="Mostrar barra lateral"
        >
          <IconSidebar size={16} />
        </button>

        <div className="app-main" ref={mainRef}>
          <Topbar
            mode={mode}   onMode={setMode}
            theme={theme} onTheme={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')}
            breadcrumb={breadcrumb}
          />
          <div className="app-canvas">
            {pageContent}
          </div>
        </div>

        {searchOpen  && <SearchModal   onClose={() => setSearchOpen(false)}   onNavigate={setRoute} />}
        {settingsOpen && <SettingsModal user={user} onSave={setUser} onClose={() => setSettingsOpen(false)} />}
        {loggedOut   && <LoggedOutScreen user={user} onReturn={() => setLoggedOut(false)} />}

        <EditToolbar visible={mode === 'edit'} />
      </div>
    </ToastProvider>
  )
}
