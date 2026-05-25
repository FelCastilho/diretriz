// src/pages/Visual.jsx
import { Block, InsertRail, SectionLabel, PageHeader, Embed, ImgSlot, ColorSwatch, DownloadRow } from '../components/Atoms'
import { IconFigma, IconSearch, IconUsers, IconDownload, IconShare, IconLock, IconEdit, IconEye, IconPlus, IconCheck, IconX, IconImage, IconLink, IconLayers, IconPlay, IconSparkle, IconMoon } from '../components/Icons'
import { BRAND_NAME } from '../components/Atoms'

export function PageLogotipo() {
  return (
    <>
      <PageHeader eyebrow="Universo Visual · Logotipo"
        title="O logotipo é a assinatura. Tratado como tal."
        lede="As regras a seguir não são preferências — são as condições para que a marca seja reconhecida em qualquer aplicação."
        tags={[{ label: 'Sincronizado · Mestre', variant: 'synced' }]} />
      <Block type="apresentação">
        <SectionLabel idx="01">Versão primária</SectionLabel>
        <div style={{ aspectRatio: '2.2', background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 64 }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 120, letterSpacing: 0, lineHeight: 1 }}>{BRAND_NAME}</span>
        </div>
        <DownloadRow title="Logotipo Primário" sub="Para fundos escuros · padrão" />
        <DownloadRow title="Logotipo Mono · Preto" sub="Para fundos claros · alto contraste" formats={['SVG', 'PNG']} />
        <DownloadRow title="Símbolo · Reduzido" sub="Favicon, ícone de app, avatar" formats={['SVG', 'PNG', 'ICO']} />
      </Block>
      <InsertRail />
      <Block type="grid">
        <SectionLabel idx="02">Usos incorretos</SectionLabel>
        <div className="grid-3" style={{ gap: 12 }}>
          {[
            { label: 'Não rotacione', style: { transform: 'rotate(-12deg)' } },
            { label: 'Não estique', style: { transform: 'scaleX(1.6) scaleY(0.7)' } },
            { label: 'Não troque a cor', style: { color: '#FF6B6B' } },
            { label: 'Não aplique sombra', style: { textShadow: '4px 4px 12px rgba(255,255,255,0.4)' } },
            { label: 'Não use sobre cor saturada', style: {}, bg: '#FF6B6B' },
            { label: 'Não esprema o respiro', style: {}, pad: 4 },
          ].map((m, i) => (
            <div key={i} className="misuse-cell" style={{ background: m.bg, padding: m.pad || 24 }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 24, color: '#FFFFFF', letterSpacing: 0, ...m.style }}>{BRAND_NAME}</span>
              <div className="misuse-label">{String(i + 1).padStart(2, '0')} · {m.label}</div>
            </div>
          ))}
        </div>
      </Block>
      <InsertRail />
      <Block type="reduções">
        <SectionLabel idx="03">Tamanhos mínimos</SectionLabel>
        <div className="grid-3" style={{ gap: 16 }}>
          {[
            { label: 'Digital', min: '120px largura', body: 'Telas: web, app, embeds.' },
            { label: 'Impressão', min: '24mm largura', body: 'Papelaria, sinalização, peças impressas.' },
            { label: 'Bordado / Gravado', min: '40mm largura', body: 'Têxteis e ofícios — pede mais respiro.' },
          ].map(r => (
            <div key={r.label} style={{ padding: 28, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', letterSpacing: 0.1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>{r.label}</div>
              <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 18, fontWeight: 600 }}>{r.min}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.55 }}>{r.body}</div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}

export function PageCores() {
  const primary = [
    { name: 'Tinta 01', hex: '#0D0D0D', rgb: '13 · 13 · 13', cmyk: '0 / 0 / 0 / 95', pantone: 'Black 6 C' },
    { name: 'Papel 01', hex: '#FAF9FA', rgb: '250 · 249 · 250', cmyk: '0 / 1 / 0 / 2', pantone: 'Off White' },
    { name: 'Acento 01', hex: '#D1EDFF', rgb: '209 · 237 · 255', cmyk: '18 / 7 / 0 / 0', pantone: '656 C' },
  ]
  const secondary = [
    { name: 'Pedra', hex: '#262626', rgb: '38 · 38 · 38', cmyk: '0 / 0 / 0 / 85', pantone: 'Black 4 C' },
    { name: 'Névoa', hex: '#A3A3A3', rgb: '163 · 163 · 163', cmyk: '0 / 0 / 0 / 36', pantone: 'Cool Gray 6 C' },
    { name: 'Areia', hex: '#E8E0D5', rgb: '232 · 224 · 213', cmyk: '0 / 3 / 8 / 9', pantone: '7527 C' },
    { name: 'Musgo', hex: '#4A5A4A', rgb: '74 · 90 · 74', cmyk: '18 / 0 / 18 / 65', pantone: '5605 C' },
    { name: 'Ferrugem', hex: '#B4654A', rgb: '180 · 101 · 74', cmyk: '0 / 44 / 59 / 29', pantone: '7593 C' },
  ]
  return (
    <>
      <PageHeader eyebrow="Universo Visual · Guia de Cores"
        title="Toda cor é uma decisão. Aqui ficam as nossas."
        lede="Clique em qualquer amostra para copiar. As cores estão organizadas em primárias e secundárias." />
      <Block type="paleta">
        <SectionLabel idx="01">Paleta primária</SectionLabel>
        <div className="page-body" style={{ marginBottom: 24 }}><p>Três cores que constroem 95% das aplicações.</p></div>
        <div className="grid-3" style={{ gap: 16 }}>{primary.map(c => <ColorSwatch key={c.name} {...c} />)}</div>
      </Block>
      <InsertRail />
      <Block type="paleta">
        <SectionLabel idx="02">Paleta secundária</SectionLabel>
        <div className="page-body" style={{ marginBottom: 24 }}><p>Cinco cores de apoio. Usadas como sotaque, nunca protagonistas.</p></div>
        <div className="grid-3" style={{ gap: 16 }}>{secondary.map(c => <ColorSwatch key={c.name} {...c} />)}</div>
      </Block>
      <InsertRail />
      <Block type="proporções">
        <SectionLabel idx="03">Proporção de uso · 60 / 25 / 10 / 5</SectionLabel>
        <div style={{ display: 'flex', height: 72, borderRadius: 10, overflow: 'hidden', border: '0.5px solid var(--border-input)' }}>
          <div style={{ flex: 60, background: '#0D0D0D', display: 'flex', alignItems: 'center', padding: '0 18px', color: '#fff', fontSize: 12, fontWeight: 600 }}>Tinta 01 · 60%</div>
          <div style={{ flex: 25, background: '#FAF9FA', display: 'flex', alignItems: 'center', padding: '0 18px', color: '#010511', fontSize: 12, fontWeight: 600 }}>Papel 01 · 25%</div>
          <div style={{ flex: 10, background: '#D1EDFF', display: 'flex', alignItems: 'center', padding: '0 18px', color: '#010511', fontSize: 12, fontWeight: 600 }}>Acento · 10%</div>
          <div style={{ flex: 5, background: '#262626', display: 'flex', alignItems: 'center', padding: '0 12px', color: '#A3A3A3', fontSize: 11, fontWeight: 500 }}>5%</div>
        </div>
      </Block>
      <InsertRail />
      <Block type="contraste">
        <SectionLabel idx="04">Combinações aprovadas</SectionLabel>
        <div className="grid-3" style={{ gap: 12 }}>
          {[
            { fg: '#FAF9FA', bg: '#0D0D0D', ratio: '20.5:1', label: 'Padrão dark' },
            { fg: '#0D0D0D', bg: '#FAF9FA', ratio: '20.5:1', label: 'Padrão light' },
            { fg: '#0D0D0D', bg: '#D1EDFF', ratio: '16.2:1', label: 'Acento sobre claro' },
            { fg: '#FAF9FA', bg: '#262626', ratio: '12.6:1', label: 'Superfície dark' },
            { fg: '#D1EDFF', bg: '#0D0D0D', ratio: '16.4:1', label: 'Acento sobre escuro' },
            { fg: '#A3A3A3', bg: '#0D0D0D', ratio: '7.8:1',  label: 'Texto secundário' },
          ].map((c, i) => (
            <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: '0.5px solid var(--border-input)' }}>
              <div style={{ background: c.bg, color: c.fg, padding: 24, aspectRatio: '2/1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>{c.label}</div>
                <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.01em' }}>Aa</div>
              </div>
              <div style={{ padding: '10px 16px', background: 'var(--bg-input)', fontSize: 11, color: 'var(--fg-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'ui-monospace,monospace' }}>{c.ratio}</span>
                <span style={{ color: 'var(--color-accent-sky)', fontWeight: 600 }}>AAA</span>
              </div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}

export function PageTipografia() {
  const specimens = [
    { label: 'Display', weight: 'Semibold · 600', size: '72px / 1.02', tracking: '-0.025em', body: 'Manhãs novas, decisões precisas.', noteSize: 72 },
    { label: 'H1 · Título de página', weight: 'Semibold · 600', size: '48px / 1.05', tracking: '-0.02em', body: 'Onde a marca se planta.', noteSize: 48 },
    { label: 'H2 · Subtítulo', weight: 'Semibold · 600', size: '32px / 1.15', tracking: '-0.015em', body: 'Quatro traços fixos do tom.', noteSize: 32 },
    { label: 'Lede', weight: 'Medium · 500', size: '20px / 1.45', tracking: '0', body: 'Um percurso editorial pelo que somos, por que existimos e como nos comportamos.', noteSize: 20 },
    { label: 'Body', weight: 'Medium · 500', size: '16px / 1.6', tracking: '0', body: 'Esta é a casa viva da marca. Não é um PDF estático que envelhece em um drive.', noteSize: 16 },
    { label: 'Caption', weight: 'Medium · 500', size: '12px / 1.4', tracking: '0.02em', body: 'Última atualização · 12 maio 2026', noteSize: 12 },
  ]
  return (
    <>
      <PageHeader eyebrow="Universo Visual · Tipografia"
        title="Uma família, dois pesos, sem exceções."
        lede="A marca usa Inter em Medium (500) e Semibold (600) apenas." />
      <Block type="família">
        <SectionLabel idx="01">Família</SectionLabel>
        <div className="grid-2" style={{ gap: 24 }}>
          <div style={{ padding: 40, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 14 }}>
            <div style={{ fontSize: 120, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 16 }}>Aa</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>Inter</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 6 }}>Sans-serif · variável · Open source</div>
          </div>
          <div style={{ padding: 40, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', letterSpacing: 0.1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>Pesos autorizados</div>
              <div style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.1 }}>Medium</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'ui-monospace,monospace', marginTop: 4 }}>500 · corpo e labels</div>
              <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.1, marginTop: 24 }}>Semibold</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'ui-monospace,monospace', marginTop: 4 }}>600 · títulos e destaques</div>
            </div>
            <DownloadRow title="Inter · família completa" sub="OTF, WOFF2, variable" formats={['OTF', 'WOFF2']} thumb={<span style={{ fontWeight: 700, fontSize: 14 }}>Aa</span>} />
          </div>
        </div>
      </Block>
      <InsertRail />
      <Block type="escala">
        <SectionLabel idx="02">Escala tipográfica</SectionLabel>
        <div>
          {specimens.map(s => (
            <div key={s.label} className="type-specimen">
              <div className="type-specimen-meta">
                <strong>{s.label}</strong>
                {s.weight}<br />{s.size}<br />tracking {s.tracking}
              </div>
              <div style={{ fontSize: s.noteSize, fontWeight: s.weight.includes('600') ? 600 : 500, letterSpacing: s.tracking, lineHeight: s.noteSize > 32 ? 1.1 : 1.5 }}>
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}

export function PageGrafismos() {
  return (
    <>
      <PageHeader eyebrow="Universo Visual · Grafismos"
        title="Elementos gráficos auxiliares — ritmo, textura, respiro."
        lede="Grafismos não são logotipos. São tijolos visuais que constroem o sistema." />
      <Block type="biblioteca">
        <SectionLabel idx="01">Biblioteca</SectionLabel>
        <div className="grid-4" style={{ gap: 12, marginTop: 8 }}>
          {[
            { name: 'Hairline', svg: <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" /> },
            { name: 'Quadrante', svg: <><line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1" /><line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1" /></> },
            { name: 'Bolha', svg: <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.6" /> },
            { name: 'Anel', svg: <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" /> },
            { name: 'Grid 3×3', svg: <>{[1, 2].flatMap(i => [<line key={`v${i}`} x1={i * 33.3} y1="0" x2={i * 33.3} y2="100" stroke="currentColor" strokeWidth="0.5" />, <line key={`h${i}`} x1="0" y1={i * 33.3} x2="100" y2={i * 33.3} stroke="currentColor" strokeWidth="0.5" />])}</> },
            { name: 'Seta', svg: <path d="M20 50 L80 50 M60 30 L80 50 L60 70" stroke="currentColor" strokeWidth="2" fill="none" /> },
            { name: 'Asterisco', svg: <>{[0, 45, 90, 135].map(a => <line key={a} x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="2" transform={`rotate(${a} 50 50)`} />)}</> },
            { name: 'Diagonal', svg: <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="1" /> },
          ].map(g => (
            <div key={g.name} style={{ padding: 24, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 12, aspectRatio: 1, display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--fg-primary)' }}>
              <div style={{ flex: 1, padding: 8 }}><svg viewBox="0 0 100 100" width="100%" height="100%">{g.svg}</svg></div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-muted)' }}>{g.name}</div>
            </div>
          ))}
        </div>
      </Block>
      <InsertRail />
      <Block type="downloads">
        <SectionLabel idx="02">Arquivos</SectionLabel>
        <DownloadRow title="Biblioteca de grafismos · SVG" sub="8 elementos · 1 arquivo .zip" formats={['SVG', 'ZIP']} />
        <DownloadRow title="Padrão diagonal · pattern" sub="Para fundos extensos · repetível" formats={['SVG', 'PNG']} />
      </Block>
    </>
  )
}

export function PageIconografia() {
  const iconList = ['search', 'users', 'download', 'share', 'lock', 'edit', 'eye', 'plus', 'check', 'x', 'image', 'link', 'layers', 'play', 'sparkle', 'moon']
  const IconMap = { search: IconSearch, users: IconUsers, download: IconDownload, share: IconShare, lock: IconLock, edit: IconEdit, eye: IconEye, plus: IconPlus, check: IconCheck, x: IconX, image: IconImage, link: IconLink, layers: IconLayers, play: IconPlay, sparkle: IconSparkle, moon: IconMoon }
  return (
    <>
      <PageHeader eyebrow="Universo Visual · Iconografia"
        title="Pictogramas geométricos, com 1,5px de traço — uniformes."
        lede="A marca usa ícones de linha, com cantos retos e ângulos a 0/45/90º." />
      <Block type="biblioteca">
        <SectionLabel idx="01">Biblioteca · 64 ícones</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 12, overflow: 'hidden' }}>
          {Array.from({ length: 32 }).map((_, i) => {
            const name = iconList[i % iconList.length]
            const Ic = IconMap[name]
            return (
              <div key={i} style={{ aspectRatio: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, borderRight: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
                <Ic size={22} />
                <div style={{ fontSize: 9.5, color: 'var(--fg-muted)', fontFamily: 'ui-monospace,monospace' }}>{name}</div>
              </div>
            )
          })}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 12 }}>Mostrando 32 de 64 ícones. Use ⌘K para buscar por nome.</div>
      </Block>
      <InsertRail />
      <Block type="downloads">
        <SectionLabel idx="02">Arquivos</SectionLabel>
        <DownloadRow title="Pacote completo · 64 ícones" sub="SVG individuais + Figma library" formats={['ZIP', 'FIG']} />
        <DownloadRow title="Sprite SVG" sub="1 arquivo, todos os ícones com IDs" formats={['SVG']} />
      </Block>
    </>
  )
}

export function PageFotografia() {
  return (
    <>
      <PageHeader eyebrow="Universo Visual · Estilo Fotográfico"
        title="Imagens cinematográficas, levemente desaturadas, sempre frias."
        lede="A fotografia da marca recusa o calor exagerado e a saturação artificial. Procura presença, não pose." />
      <Block type="referência">
        <SectionLabel idx="01">Referências visuais</SectionLabel>
        <div className="photo-grid">
          <div className="wide"><ImgSlot label="Imagem-referência · paisagem ampla" aspect="2" style={{ height: '100%' }} /></div>
          <div><ImgSlot label="Retrato · luz lateral" aspect="1" style={{ height: '100%' }} /></div>
          <div><ImgSlot label="Detalhe · textura" aspect="1" style={{ height: '100%' }} /></div>
          <div><ImgSlot label="Objeto · espaço vazio" aspect="1" style={{ height: '100%' }} /></div>
          <div className="tall"><ImgSlot label="Vertical · figura humana" aspect="1/2" style={{ height: '100%' }} /></div>
          <div><ImgSlot label="Paisagem · cor fria" aspect="1" style={{ height: '100%' }} /></div>
          <div><ImgSlot label="Macro · grão visível" aspect="1" style={{ height: '100%' }} /></div>
          <div><ImgSlot label="Arquitetura" aspect="1" style={{ height: '100%' }} /></div>
        </div>
      </Block>
      <InsertRail />
      <Block type="parâmetros">
        <SectionLabel idx="02">Parâmetros técnicos</SectionLabel>
        <div className="grid-3" style={{ gap: 16 }}>
          {[
            { k: 'Temperatura', v: '5600K – 6500K', note: 'Frio para neutro. Nunca quente.' },
            { k: 'Saturação', v: '−15% a −25%', note: 'Sempre dessaturado em relação ao RAW.' },
            { k: 'Contraste', v: 'Médio', note: 'Sombras visíveis · highlights preservados.' },
            { k: 'Grão', v: 'Sutil · 18 ISO equiv.', note: 'Aceitável · evita o look digital.' },
            { k: 'Proporções', v: '4:5 · 3:2 · 16:9', note: 'Quadrado só em redes sociais.' },
            { k: 'Profundidade', v: 'f/2.8 – f/5.6', note: 'Foco seletivo.' },
          ].map(p => (
            <div key={p.k} style={{ padding: 22, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 10 }}>
              <div style={{ fontSize: 10.5, color: 'var(--fg-muted)', letterSpacing: 0.1, textTransform: 'uppercase', fontWeight: 600 }}>{p.k}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 6, fontFamily: 'ui-monospace,monospace' }}>{p.v}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 8 }}>{p.note}</div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}
