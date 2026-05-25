// src/pages/Overview.jsx
import { Block, InsertRail, SectionLabel, PageHeader, Embed, ImgSlot, Tag } from '../components/Atoms'
import { IconLock, IconSparkle, IconUsers, IconLink, IconChevR, IconPlay } from '../components/Icons'
import { BRAND_NAME } from '../components/Atoms'

export function PageVisaoGeral({ nav }) {
  return (
    <>
      <PageHeader eyebrow="Overview · Visão Geral"
        title="O ponto de partida para qualquer pessoa que toque a marca."
        lede="Um percurso editorial pelo que somos, por que existimos e como nos comportamos. Tudo o que vem a seguir parte daqui."
        tags={[{ label: 'Público · acesso aberto' }]}
        meta={[
          { label: 'Última atualização', value: '12 maio · 2026' },
          { label: 'Versão', value: 'v3.2' },
          { label: 'Responsável', value: 'Estúdio Diretriz' },
          { label: 'Leitura', value: '~4 min' },
        ]}
      />
      <Block type="texto">
        <SectionLabel idx="01">Apresentação</SectionLabel>
        <div className="page-body">
          <p>Esta é a casa viva da marca <strong>{BRAND_NAME}</strong>. Não é um PDF estático que envelhece em um drive — é o lugar onde as decisões de identidade são tomadas, registradas, e onde qualquer pessoa encontra a resposta certa.</p>
          <p>O sistema está organizado em cinco territórios: a <strong>Overview</strong> que você lê agora; o <strong>Núcleo</strong>; o <strong>Universo Verbal</strong>; o <strong>Universo Visual</strong>; e as <strong>Aplicações</strong>, onde a teoria vira peça concreta.</p>
        </div>
      </Block>
      <InsertRail />
      <Block type="navegação">
        <SectionLabel idx="02">Mapa do Brand System</SectionLabel>
        <div className="grid-3" style={{ marginTop: 8 }}>
          {[
            { idx: '01', title: 'Núcleo da Marca', sub: 'Posicionamento, propósito, arquétipos, público, arquitetura.', route: 'nucleo/posicionamento' },
            { idx: '02', title: 'Universo Verbal', sub: 'Manifesto, tom de voz, vocabulário, territórios de palavras.', route: 'verbal/manifesto' },
            { idx: '03', title: 'Universo Visual', sub: 'Logotipo, cores, tipografia, grafismos, ícones, fotografia.', route: 'visual/logotipo' },
            { idx: '04', title: 'Aplicações', sub: 'Papelaria institucional e presença digital.', route: 'aplicacoes/papelaria' },
            { idx: '05', title: 'Bandeiras', sub: 'Os compromissos públicos da marca.', route: 'overview/bandeiras' },
            { idx: '06', title: 'Por que existe', sub: 'A razão de ser, a tensão original.', route: 'overview/existe' },
          ].map(c => (
            <button key={c.title} onClick={() => nav(c.route)} style={{ textAlign: 'left', padding: '22px 22px 26px', background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 12, cursor: 'pointer', color: 'var(--fg-primary)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'var(--fg-muted)' }}>{c.idx}</span>
                <IconChevR size={11} color="var(--fg-muted)" />
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2, marginTop: 8 }}>{c.title}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--fg-muted)' }}>{c.sub}</div>
            </button>
          ))}
        </div>
      </Block>
      <InsertRail />
      <Block type="texto">
        <SectionLabel idx="03">Como ler este sistema</SectionLabel>
        <div className="grid-2" style={{ gap: 48 }}>
          <div className="page-body">
            <p>Cada página é construída por <strong>blocos modulares</strong> que podem ser reordenados e sincronizados automaticamente.</p>
            <p>Procure pelo ícone <em>cadeado</em> para páginas com acesso restrito; use a barra de busca (⌘K) para perguntar ao Assistente.</p>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            {[
              { icon: <IconLock size={13} color="var(--color-accent-sky)" />, label: 'Página privada — SSO obrigatório' },
              { icon: <IconSparkle size={13} color="var(--color-accent-sky)" />, label: 'Sincronizada com a Marca Mestre' },
              { icon: <IconUsers size={13} color="var(--color-accent-sky)" />, label: 'Link público — acesso de leitura' },
              { icon: <IconLink size={13} color="var(--color-accent-sky)" />, label: 'Conteúdo embedado de fonte externa' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', fontSize: 12.5, color: 'var(--fg-secondary)' }}>{r.icon}{r.label}</div>
            ))}
          </div>
        </div>
      </Block>
    </>
  )
}

export function PagePorQueExiste() {
  return (
    <>
      <PageHeader eyebrow="Overview · Por que a marca existe"
        title="Toda marca começa como uma tensão entre o que é e o que poderia ser."
        lede="Antes do logotipo, antes da paleta, antes do tom de voz — existe um motivo." />
      <Block type="texto">
        <SectionLabel idx="01">A tensão original</SectionLabel>
        <div className="page-body" style={{ fontSize: 19, lineHeight: 1.55, maxWidth: '62ch' }}>
          <p style={{ fontSize: 28, lineHeight: 1.3, fontWeight: 500, color: 'var(--fg-primary)', textWrap: 'balance', marginBottom: 32 }}>
            <strong>{BRAND_NAME}</strong> existe porque há um problema mal resolvido no mundo, e nós escolhemos resolvê-lo de um jeito que ninguém mais escolheu.
          </p>
          <p>[Descreva aqui a tensão original — o desconforto, a injustiça, a ineficiência ou a possibilidade que justifica a existência da marca.]</p>
        </div>
      </Block>
      <InsertRail />
      <Block type="mídia">
        <SectionLabel idx="02">Imagem-chave</SectionLabel>
        <ImgSlot label="Solte aqui a imagem-chave do Brand Story" aspect="2.35" />
        <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 12, maxWidth: '60ch' }}>Imagem cinematográfica, levemente desaturada — alinhada ao guia de Estilo Fotográfico.</div>
      </Block>
      <InsertRail />
      <Block type="texto">
        <SectionLabel idx="03">Três frases que resumem</SectionLabel>
        <div className="grid-3" style={{ gap: 32 }}>
          {[
            { n: '01', title: 'O que vemos hoje', body: '[Uma frase descrevendo a realidade atual, o status quo que incomoda.]' },
            { n: '02', title: 'O que acreditamos', body: '[Uma frase declarando a crença que move a marca.]' },
            { n: '03', title: 'O que entregamos', body: '[Uma frase concreta sobre o que a marca faz para mudar essa realidade.]' },
          ].map(c => (
            <div key={c.n}>
              <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'var(--fg-muted)', marginBottom: 14 }}>{c.n}</div>
              <div style={{ fontSize: 17, lineHeight: 1.45, fontWeight: 500, color: 'var(--fg-primary)' }}>{c.title}.</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg-muted)', marginTop: 10 }}>{c.body}</div>
            </div>
          ))}
        </div>
      </Block>
      <InsertRail />
      <Block type="embed">
        <SectionLabel idx="04">Conversa com o time fundador</SectionLabel>
        <Embed kind="Vídeo" title="Manifesto · entrevista de 4 minutos">
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <IconPlay size={22} />
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: 'var(--fg-muted)' }}>vimeo.com/diretriz/manifesto</div>
          </div>
        </Embed>
      </Block>
    </>
  )
}

export function PageBandeiras() {
  const flags = [
    { n: '01', title: 'Compromisso', body: '[Descreva a primeira bandeira — um compromisso público que a marca defende, mesmo quando dá trabalho.]' },
    { n: '02', title: 'Compromisso', body: '[Descreva a segunda bandeira — algo que diferencia esta marca das demais no mercado.]' },
    { n: '03', title: 'Compromisso', body: '[Descreva a terceira bandeira — uma promessa concreta que orienta decisões diárias.]' },
    { n: '04', title: 'Compromisso', body: '[Quarta bandeira — opcional. Mantenha entre 3 e 5 no total.]' },
  ]
  return (
    <>
      <PageHeader eyebrow="Overview · Bandeiras da Marca"
        title="Aquilo que defendemos, mesmo quando ninguém está olhando."
        lede="Bandeiras não são slogans. São compromissos públicos escritos para serem cobrados, não decorados." />
      <Block type="lista">
        <div className="stack" style={{ gap: 0, marginTop: 8 }}>
          {flags.map((f, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 220px', gap: 32, padding: '36px 0', borderTop: '1px solid var(--border-hairline)', borderBottom: i === flags.length - 1 ? '1px solid var(--border-hairline)' : 'none', alignItems: 'start' }}>
              <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 13, color: 'var(--fg-muted)', paddingTop: 6 }}>{f.n}</div>
              <div>
                <div className="page-h2" style={{ marginBottom: 12 }}>{f.title}</div>
                <div className="page-body" style={{ fontSize: 16 }}>{f.body}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 6 }}>
                <Tag>Verificável</Tag>
                <Tag>Atualizada · 04/26</Tag>
              </div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}
