// src/pages/Nucleo.jsx
import { Block, InsertRail, SectionLabel, PageHeader, Embed, ImgSlot, Banner, Tag } from '../components/Atoms'
import { IconLock, IconSparkle, IconChevR, IconLayers } from '../components/Icons'
import { BRAND_NAME } from '../components/Atoms'

export function PagePosicionamento({ nav }) {
  const competitors = [
    { x: 25, y: 70, label: 'Concorrente A' },
    { x: 70, y: 30, label: 'Concorrente B' },
    { x: 50, y: 50, label: 'Concorrente C' },
    { x: 78, y: 78, label: BRAND_NAME, us: true },
  ]
  return (
    <>
      <PageHeader eyebrow="Núcleo · Posicionamento"
        title="Onde a marca decide ficar, sabendo que não pode ficar em todo lugar."
        lede="Posicionamento é uma escolha de território."
        tags={[{ label: 'Privado · SSO', variant: 'private' }]} />
      <Banner icon={<IconLock size={16} color="var(--color-accent-sky)" />}
        text={<><strong>Conteúdo confidencial.</strong> Esta página é visível apenas para colaboradores autenticados via SSO.</>}
        action={<button className="btn-pill">Gerenciar acesso</button>} />
      <Block type="declaração">
        <SectionLabel idx="01">Declaração de Posicionamento</SectionLabel>
        <div style={{ padding: '48px 56px', background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 16, fontSize: 24, lineHeight: 1.45, fontWeight: 500, color: 'var(--fg-primary)', textWrap: 'balance' }}>
          Para <span style={{ color: 'var(--color-accent-sky)' }}>[público-alvo]</span> que enfrenta <span style={{ color: 'var(--color-accent-sky)' }}>[tensão central]</span>, a <strong>{BRAND_NAME}</strong> é a <span style={{ color: 'var(--color-accent-sky)' }}>[categoria]</span> que oferece <span style={{ color: 'var(--color-accent-sky)' }}>[benefício único]</span>, porque <span style={{ color: 'var(--color-accent-sky)' }}>[razão para acreditar]</span>.
        </div>
      </Block>
      <InsertRail />
      <Block type="grid">
        <SectionLabel idx="02">Os quatro pilares</SectionLabel>
        <div className="grid-2" style={{ gap: 18 }}>
          {[
            { n: '01', title: 'Público-Alvo', body: 'Quem precisa de nós e por que.', route: 'nucleo/publico' },
            { n: '02', title: 'Tensão Central', body: 'O problema mal resolvido que justifica nossa existência.' },
            { n: '03', title: 'Benefício Único', body: 'Aquilo que entregamos que ninguém entrega do mesmo jeito.' },
            { n: '04', title: 'Razão para Crer', body: 'As provas concretas que sustentam a promessa.' },
          ].map(p => (
            <div key={p.n} style={{ padding: 28, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'var(--fg-muted)' }}>{p.n}</span>
                {p.route && <button className="btn-ghost" style={{ padding: '5px 9px', fontSize: 10.5 }} onClick={() => nav(p.route)}>abrir <IconChevR size={9} /></button>}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{p.title}</div>
              <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', lineHeight: 1.55 }}>{p.body}</div>
            </div>
          ))}
        </div>
      </Block>
      <InsertRail />
      <Block type="mapa">
        <SectionLabel idx="03">Mapa competitivo</SectionLabel>
        <div style={{ position: 'relative', aspectRatio: '1.4', padding: 40, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 12 }}>
          <div style={{ position: 'absolute', inset: 40 }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--border-hairline)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border-hairline)' }} />
            <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 10.5, color: 'var(--fg-muted)', letterSpacing: 0.06, textTransform: 'uppercase', fontWeight: 600 }}>Mais experimental</div>
            <div style={{ position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 10.5, color: 'var(--fg-muted)', letterSpacing: 0.06, textTransform: 'uppercase', fontWeight: 600 }}>Mais conservador</div>
            {competitors.map((c, i) => (
              <div key={i} style={{ position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ width: c.us ? 16 : 10, height: c.us ? 16 : 10, borderRadius: '50%', background: c.us ? 'var(--color-accent-sky)' : 'var(--fg-muted)', margin: '0 auto', boxShadow: c.us ? '0 0 0 6px rgba(209,237,255,0.15)' : 'none' }} />
                <div style={{ fontSize: c.us ? 13 : 11, marginTop: 8, fontWeight: c.us ? 600 : 500, color: c.us ? 'var(--fg-primary)' : 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Block>
    </>
  )
}

export function PageVisaoProposito() {
  return (
    <>
      <PageHeader eyebrow="Núcleo · Visão e Propósito"
        title="O futuro que perseguimos, e a razão concreta de existir hoje."
        lede="Visão é onde queremos chegar. Propósito é o motivo de cada manhã." />
      <div className="grid-2" style={{ gap: 24, marginBottom: 64 }}>
        {[
          { label: 'Visão', note: 'Horizonte: 2030', gradient: 'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,rgba(209,237,255,0.04) 100%)' },
          { label: 'Propósito', note: 'Ativo · contínuo', gradient: 'linear-gradient(180deg,rgba(255,255,255,0.02) 0%,rgba(255,255,255,0.05) 100%)' },
        ].map(d => (
          <Block key={d.label} type="declaração">
            <div style={{ padding: '44px 36px 36px', aspectRatio: '1.1', background: d.gradient, border: '0.5px solid var(--border-input)', borderRadius: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="page-eyebrow" style={{ margin: 0 }}>{d.label}</div>
              <div style={{ fontSize: 32, lineHeight: 1.2, fontWeight: 500, color: 'var(--fg-primary)', textWrap: 'balance', letterSpacing: '-0.01em' }}>[Uma frase {d.label === 'Visão' ? 'ambiciosa, no futuro, descrevendo o mundo que existirá quando a marca cumprir seu papel' : 'no presente, declarando para quem e por que a marca trabalha todos os dias'}.]</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', letterSpacing: 0.04 }}>{d.note}</div>
            </div>
          </Block>
        ))}
      </div>
      <Block type="valores">
        <SectionLabel idx="02">Valores que sustentam</SectionLabel>
        <div className="grid-3" style={{ gap: 16 }}>
          {['Verdade', 'Foco', 'Generosidade', 'Rigor', 'Curiosidade', 'Cuidado'].map((v, i) => (
            <div key={v} style={{ padding: '32px 24px', background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 12 }}>
              <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'var(--fg-muted)', marginBottom: 14 }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>{v}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--fg-muted)' }}>[Uma frase sobre o que este valor significa em comportamento concreto.]</div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}

export function PageArquetipos() {
  const archetypes = [
    { name: 'Sábio', n: '01', primary: true, body: 'Busca a verdade, ensina, decodifica complexidade.', color: '#D1EDFF' },
    { name: 'Criador', n: '02', primary: false, body: 'Trabalha com originalidade e ofício.', color: '#E8E0FF' },
    { name: 'Explorador', n: '03', primary: false, body: 'Procura o que ainda não foi visto.', color: '#FFE6D5' },
  ]
  return (
    <>
      <PageHeader eyebrow="Núcleo · Arquétipos"
        title="A personalidade da marca, contada em padrões antigos."
        lede="Arquétipos não engessam — orientam. Esta página define os padrões dominantes da marca." />
      <Block type="grid">
        <SectionLabel idx="01">Mix de arquétipos</SectionLabel>
        <div className="grid-3" style={{ gap: 16 }}>
          {archetypes.map(a => (
            <div key={a.name} style={{ padding: 28, background: 'var(--bg-input)', border: a.primary ? '1px solid var(--color-accent-sky)' : '0.5px solid var(--border-input)', borderRadius: 12, position: 'relative' }}>
              {a.primary && <div style={{ position: 'absolute', top: -10, left: 20, padding: '3px 9px', background: 'var(--color-accent-sky)', color: 'var(--color-ink-900)', fontSize: 9, fontWeight: 700, letterSpacing: 0.1, textTransform: 'uppercase', borderRadius: 999 }}>Primário · 60%</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: a.color, opacity: 0.2 }} />
                <div>
                  <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'var(--fg-muted)' }}>{a.n}</div>
                  <div style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>{a.name}</div>
                </div>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', lineHeight: 1.55 }}>{a.body}</div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}

export function PagePublico() {
  return (
    <>
      <PageHeader eyebrow="Núcleo · Público-Alvo"
        title="As pessoas para quem a marca existe — descritas com cuidado, não com clichês."
        lede="Personas não são fichas demográficas. São retratos vivos do contexto, do desejo e da resistência." />
      <Block type="personas">
        <SectionLabel idx="01">Três audiências centrais</SectionLabel>
        <div className="stack" style={{ gap: 16 }}>
          {[
            { n: '01', role: 'Persona Primária', title: '[Apelido descritivo]', wants: '[O que essa pessoa quer alcançar — o desejo profundo, não o pedido superficial.]', fears: '[O que ela teme — a resistência que precisamos endereçar.]' },
            { n: '02', role: 'Persona Secundária', title: '[Apelido descritivo]', wants: '[Desejo.]', fears: '[Medo.]' },
            { n: '03', role: 'Persona Terciária', title: '[Apelido descritivo]', wants: '[Desejo.]', fears: '[Medo.]' },
          ].map(p => (
            <div key={p.n} style={{ padding: 32, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 12, display: 'grid', gridTemplateColumns: '160px 1fr 1fr', gap: 32 }}>
              <div>
                <ImgSlot label={`Retrato · ${p.role}`} aspect="1" style={{ borderRadius: 12 }} />
                <div style={{ fontSize: 9.5, color: 'var(--fg-muted)', letterSpacing: 0.1, textTransform: 'uppercase', fontWeight: 600, marginTop: 12 }}>{p.role}</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 6 }}>{p.title}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: 'var(--fg-muted)', letterSpacing: 0.1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>O que ela quer</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-secondary)' }}>{p.wants}</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: 'var(--fg-muted)', letterSpacing: 0.1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>O que ela teme</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-secondary)' }}>{p.fears}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}

export function PageArquitetura() {
  return (
    <>
      <PageHeader eyebrow="Núcleo · Arquitetura de Marca"
        title="Como nossas marcas se conectam, e o que isso significa."
        lede="A arquitetura governa hierarquia, herança visual e regras de co-branding."
        tags={[{ label: 'Sincronizado · Marca Mestre', variant: 'synced' }]} />
      <Banner icon={<IconSparkle size={16} color="var(--color-accent-sky)" />}
        text={<><strong>Master Brand System ativo.</strong> Alterações propagam para todas as sub-marcas conectadas.</>}
        action={<button className="btn-pill">Ver sub-marcas (4)</button>} />
      <Block type="diagrama">
        <SectionLabel idx="01">Hierarquia atual</SectionLabel>
        <div className="arch-diagram">
          <div className="arch-node" style={{ border: '1px solid var(--color-accent-sky)', background: 'rgba(209,237,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--color-accent-sky)' }} />
              <div>
                <div className="arch-node-title">{BRAND_NAME} · Marca Mestre</div>
                <div className="arch-node-sub">Fonte da verdade · governa estratégia e visual</div>
              </div>
            </div>
            <Tag variant="synced">Master · 4 conexões ativas</Tag>
          </div>
          <div className="arch-children">
            {['Sub-marca A · B2B', 'Sub-marca B · B2C', 'Sub-marca C · Regional'].map((n, i) => (
              <div key={i} className="arch-node">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: '#A3A3A3' }} />
                  <div>
                    <div className="arch-node-title" style={{ fontSize: 13 }}>{n.split('·')[0]}</div>
                    <div className="arch-node-sub">{n.split('·')[1]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Block>
    </>
  )
}
