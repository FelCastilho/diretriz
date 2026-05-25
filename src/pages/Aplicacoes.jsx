// src/pages/Aplicacoes.jsx
import { Block, InsertRail, SectionLabel, PageHeader, ImgSlot, DownloadRow } from '../components/Atoms'
import { IconChevR } from '../components/Icons'
import { BRAND_NAME, BrandMark } from '../components/Atoms'

export function PagePapelaria() {
  return (
    <>
      <PageHeader eyebrow="Aplicações · Papelaria Institucional"
        title="A marca em papel — cartão, carta, envelope, assinatura."
        lede="Onde o sistema encontra o ofício gráfico. Os templates abaixo são editáveis — baixe, abra no software indicado, preencha." />
      <Block type="cartão">
        <SectionLabel idx="01">Cartão de visita · 90 × 50 mm</SectionLabel>
        <div className="grid-2" style={{ gap: 24 }}>
          <div style={{ aspectRatio: '90/50', padding: 32, background: 'var(--bg-canvas)', border: '0.5px solid var(--border-input)', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <BrandMark size={22} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Nome Sobrenome</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>Cargo · Equipe</div>
              <div style={{ fontSize: 10.5, color: 'var(--fg-muted)', marginTop: 14, fontFamily: 'ui-monospace,monospace', lineHeight: 1.6 }}>nome@logotipo.com<br />+55 11 0000 0000</div>
            </div>
          </div>
          <div style={{ aspectRatio: '90/50', padding: 32, background: 'var(--bg-paper)', color: '#010511', border: '0.5px solid var(--border-input)', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <BrandMark size={22} color="#010511" />
            <div style={{ fontSize: 11, color: '#6a6d77', textAlign: 'right', fontFamily: 'ui-monospace,monospace', lineHeight: 1.6 }}>
              Rua Exemplo, 100<br />São Paulo · SP · Brasil<br />logotipo.com
            </div>
          </div>
        </div>
        <DownloadRow title="Cartão de visita · template" sub="Frente e verso · com sangria" formats={['PDF', 'AI', 'INDD']} />
      </Block>
      <InsertRail />
      <Block type="assinatura">
        <SectionLabel idx="02">Assinatura de e-mail</SectionLabel>
        <div style={{ padding: 32, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 12 }}>
          <div style={{ fontSize: 10.5, color: 'var(--fg-muted)', letterSpacing: 0.1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 18 }}>Preview · 600px largura</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, padding: '20px 24px', background: 'var(--bg-paper)', color: '#010511', borderRadius: 4, border: '1px solid #E0DFE3' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 600 }}>NS</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Nome Sobrenome</div>
              <div style={{ fontSize: 11, color: '#6a6d77', marginTop: 3 }}>Cargo · Equipe</div>
              <div style={{ height: 1, background: '#E0DFE3', margin: '10px 0' }} />
              <div style={{ display: 'flex', gap: 18, fontSize: 11, fontFamily: 'ui-monospace,monospace' }}><span>+55 11 0000 0000</span><span>logotipo.com</span></div>
              <div style={{ marginTop: 10 }}><BrandMark size={12} color="#010511" /></div>
            </div>
          </div>
        </div>
        <DownloadRow title="Assinatura de e-mail" sub="HTML pronto · Gmail, Outlook" formats={['HTML', 'ZIP']} />
      </Block>
      <InsertRail />
      <Block type="carta">
        <SectionLabel idx="03">Carta institucional · A4</SectionLabel>
        <DownloadRow title="Carta institucional" sub="A4 · editável" formats={['PDF', 'DOCX']} />
      </Block>
    </>
  )
}

export function PageDigital() {
  return (
    <>
      <PageHeader eyebrow="Aplicações · Presença Digital"
        title="A marca nas telas — site, redes, app, e-mail."
        lede="Os templates abaixo são vivos: alterações na Marca Mestre propagam aqui automaticamente."
        tags={[{ label: 'Sincronizado · 4 ativos', variant: 'synced' }]} />
      <Block type="site">
        <SectionLabel idx="01">Site institucional · hero</SectionLabel>
        <div className="app-frame">
          <div className="app-frame-bar">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span style={{ marginLeft: 14, fontFamily: 'ui-monospace,monospace' }}>logotipo.com</span>
          </div>
          <div style={{ aspectRatio: '16/9', padding: '48px 64px', background: 'var(--bg-canvas)', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignContent: 'start' }}>
            <BrandMark size={22} />
            <div style={{ display: 'flex', gap: 24, fontSize: 12, color: 'var(--fg-muted)', justifyContent: 'center' }}>
              {['Sobre', 'Produtos', 'Histórias', 'Contato'].map(n => <span key={n}>{n}</span>)}
            </div>
            <button className="btn-cta" style={{ height: 36, fontSize: 12, padding: '0 16px' }}>Falar com a equipe</button>
            <div style={{ gridColumn: '1 / -1', marginTop: 24 }}>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', letterSpacing: 0.14, textTransform: 'uppercase', fontWeight: 500, marginBottom: 18 }}>Brand System</div>
              <div style={{ fontSize: 48, fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.025em', textWrap: 'balance' }}>Onde marcas vivem, e não apenas onde são guardadas.</div>
              <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 18, maxWidth: '44ch', lineHeight: 1.55 }}>Construa diretrizes vivas, modulares, sincronizadas. Pare de mandar PDF.</div>
            </div>
          </div>
        </div>
      </Block>
      <InsertRail />
      <Block type="social">
        <SectionLabel idx="02">Redes sociais</SectionLabel>
        <div className="grid-3" style={{ gap: 14 }}>
          <div style={{ aspectRatio: 1, padding: 32, background: 'var(--bg-canvas)', border: '0.5px solid var(--border-input)', borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <BrandMark size={16} />
            <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.015em', textWrap: 'balance' }}>Diretrizes não envelhecem em PDF.</div>
            <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontFamily: 'ui-monospace,monospace' }}>logotipo.com</div>
          </div>
          <ImgSlot label="Post quadrado · foto" aspect="1" />
          <div style={{ aspectRatio: '9/16', padding: 24, background: 'var(--bg-canvas)', border: '0.5px solid var(--border-input)', borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <BrandMark size={12} />
              <div style={{ fontSize: 9, color: 'var(--fg-muted)', letterSpacing: 0.12, textTransform: 'uppercase', fontWeight: 600 }}>Story · 9:16</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.15, textWrap: 'balance' }}>Como uma marca conversa consigo mesma?</div>
            <div style={{ padding: '12px 14px', background: 'rgba(209,237,255,0.1)', borderRadius: 6, fontSize: 11, color: 'var(--color-accent-sky)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Arraste para ver →</span>
              <IconChevR size={11} color="var(--color-accent-sky)" />
            </div>
          </div>
        </div>
        <DownloadRow title="Pacote redes sociais · Figma" sub="14 templates · 4 formatos" formats={['FIG', 'ZIP']} />
      </Block>
      <InsertRail />
      <Block type="downloads">
        <SectionLabel idx="03">Arquivos da seção</SectionLabel>
        <DownloadRow title="Site · template Figma" sub="6 telas · variáveis sincronizadas" formats={['FIG', 'PDF']} />
        <DownloadRow title="App · UI kit" sub="Componentes + tokens" formats={['FIG']} />
        <DownloadRow title="E-mail transacional · HTML" sub="5 templates · pronto para integração" formats={['HTML', 'ZIP']} />
      </Block>
    </>
  )
}
