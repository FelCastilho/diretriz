// src/pages/Verbal.jsx
import { Block, InsertRail, SectionLabel, PageHeader } from '../components/Atoms'
import { IconCheck, IconX, IconShare, IconDownload } from '../components/Icons'

export function PageManifesto() {
  return (
    <>
      <PageHeader eyebrow="Universo Verbal · Manifesto"
        title="O que defendemos, dito em voz alta."
        lede="O manifesto é a marca falando consigo mesma — uma declaração pública daquilo que a move." />
      <Block type="texto editorial">
        <div style={{ padding: '64px 0', maxWidth: '62ch', fontSize: 26, lineHeight: 1.45, fontWeight: 500, color: 'var(--fg-primary)' }}>
          <p style={{ margin: 0, marginBottom: 32 }}>
            <span style={{ float: 'left', fontFamily: 'var(--font-display)', fontSize: 96, fontWeight: 600, lineHeight: 0.85, marginRight: 14, marginTop: 6, color: 'var(--fg-primary)', letterSpacing: '-0.04em' }}>A</span>
            cada nova manhã, alguém em algum lugar do mundo precisa de uma decisão tomada com clareza. Não pela pressa, mas pelo cuidado.
          </p>
          <p style={{ margin: '0 0 32px' }}>Acreditamos que a forma como uma marca aparece — a palavra que escolhe, a cor que carrega — é, ela mesma, uma decisão.</p>
          <p style={{ margin: '0 0 32px' }}>Por isso existimos: para que diretrizes deixem de ser PDFs perdidos em drives, e passem a ser estruturas que respiram com a marca.</p>
          <p style={{ margin: '48px 0 32px', padding: '32px 40px', borderLeft: '2px solid var(--color-accent-sky)', fontSize: 32, lineHeight: 1.3, fontWeight: 600, fontStyle: 'italic', color: 'var(--fg-primary)', textWrap: 'balance', letterSpacing: '-0.01em' }}>
            Não fazemos manuais. Fazemos sistemas que ensinam outras pessoas a tomar boas decisões — mesmo quando ninguém está olhando.
          </p>
          <p style={{ margin: 0 }}>E acreditamos, antes de tudo, que uma marca bem cuidada por dentro é uma marca confiável por fora.</p>
        </div>
      </Block>
      <InsertRail />
      <Block type="rodapé">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderTop: '1px solid var(--border-hairline)', fontSize: 11.5, color: 'var(--fg-muted)' }}>
          <div>Assinado pelo time fundador · 2024</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-ghost"><IconShare size={11} />Compartilhar</button>
            <button className="btn-ghost"><IconDownload size={11} />Baixar PDF</button>
          </div>
        </div>
      </Block>
    </>
  )
}

export function PageTomDeVoz() {
  const traits = [
    { name: 'Direto', body: 'Vai ao ponto. Frase curta, verbo no presente, sujeito implícito quando óbvio.' },
    { name: 'Calmo', body: 'Não usa exclamação. Não dramatiza. Não força urgência onde não há.' },
    { name: 'Específico', body: "Prefere o número ao 'muito'. O exemplo ao adjetivo. A regra ao 'em geral'." },
    { name: 'Editorial', body: 'Tem ritmo. Quebra frases longas. Usa o ponto como ferramenta de respiração.' },
  ]
  return (
    <>
      <PageHeader eyebrow="Universo Verbal · Tom de Voz"
        title="Como a marca soa — em qualquer canal, em qualquer hora."
        lede="O tom é estável. O registro muda. Aqui ficam os quatro traços fixos do tom e os três registros de uso." />
      <Block type="traços">
        <SectionLabel idx="01">Quatro traços fixos</SectionLabel>
        <div className="grid-2" style={{ gap: 16 }}>
          {traits.map((t, i) => (
            <div key={t.name} style={{ padding: 28, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 12, display: 'flex', gap: 20, alignItems: 'start' }}>
              <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'var(--fg-muted)', paddingTop: 4, minWidth: 24 }}>{String(i + 1).padStart(2, '0')}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>{t.name}</div>
                <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', lineHeight: 1.55 }}>{t.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>
      <InsertRail />
      <Block type="exemplos">
        <SectionLabel idx="02">Faça assim · Não faça assim</SectionLabel>
        <div className="tov-table">
          <div className="tov-cell do">
            <div className="tov-cell-label"><IconCheck size={11} />Faça assim</div>
            {['Acesse o sistema com seu e-mail corporativo.', 'Você pode editar este bloco. Basta clicar.', 'Atualizamos a paleta. Veja o que mudou em Cores.', 'Esta página é privada. Solicite acesso à equipe.'].map((l, i) => <div key={i} className="tov-cell-line">{l}</div>)}
          </div>
          <div className="tov-cell dont">
            <div className="tov-cell-label"><IconX size={11} />Não faça assim</div>
            {['Faça o seu login agora mesmo com a sua conta corporativa!', 'Que tal editar este bloco? É super fácil 🎨', 'UAU! A paleta foi atualizada e está incrível!', 'Sorry, esta página é privada... 😅'].map((l, i) => <div key={i} className="tov-cell-line">{l}</div>)}
          </div>
        </div>
      </Block>
      <InsertRail />
      <Block type="registros">
        <SectionLabel idx="03">Três registros</SectionLabel>
        <div className="stack" style={{ gap: 12 }}>
          {[
            { reg: 'Institucional', use: 'Site, documentação, comunicados oficiais.', example: 'A marca opera em quatro mercados regulados pela ANVISA.' },
            { reg: 'Conversacional', use: 'Redes sociais, e-mails de produto, FAQs.', example: 'Você pode trocar a senha pelo botão no canto.' },
            { reg: 'Editorial', use: 'Manifesto, brand story, conteúdo de marca.', example: 'Acreditamos que diretrizes vivem melhor quando podem respirar.' },
          ].map(r => (
            <div key={r.reg} style={{ display: 'grid', gridTemplateColumns: '180px 220px 1fr', gap: 24, padding: '20px 24px', background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 10, alignItems: 'center' }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{r.reg}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{r.use}</div>
              <div style={{ fontSize: 14, color: 'var(--fg-secondary)', fontStyle: 'italic' }}>"{r.example}"</div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}

export function PageVocabulario() {
  return (
    <>
      <PageHeader eyebrow="Universo Verbal · Vocabulário"
        title="As palavras que usamos, e as que deixamos de fora."
        lede="O vocabulário é uma curadoria viva. Aqui estão os termos preferidos e os equivalentes a evitar." />
      <Block type="vocabulário">
        <SectionLabel idx="01">Termos por categoria</SectionLabel>
        <div style={{ borderTop: '1px solid var(--border-hairline)' }}>
          {[
            { cat: 'Produto', use: ['sistema', 'plataforma', 'diretriz'], avoid: ['app', 'solução', 'ferramenta'] },
            { cat: 'Pessoas', use: ['pessoa usuária', 'equipe', 'responsável'], avoid: ['consumidor', 'user', 'colaborador'] },
            { cat: 'Ações', use: ['acessar', 'atualizar', 'publicar'], avoid: ['logar', 'subir', 'deployar'] },
            { cat: 'Hierarquia', use: ['marca mestre', 'sub-marca', 'ativo'], avoid: ['marca-mãe', 'filha', 'asset'] },
            { cat: 'Conteúdo', use: ['bloco', 'página', 'módulo'], avoid: ['card', 'screen', 'widget'] },
          ].map(v => (
            <div key={v.cat} className="vocab-row">
              <div className="vocab-row-label">{v.cat}</div>
              <div>
                <div style={{ fontSize: 10.5, color: 'var(--color-accent-sky)', letterSpacing: 0.1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Use</div>
                <div className="vocab-chips" style={{ marginBottom: 18 }}>{v.use.map(w => <span key={w} className="vocab-chip">{w}</span>)}</div>
                <div style={{ fontSize: 10.5, color: 'var(--fg-muted)', letterSpacing: 0.1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10 }}>Evite</div>
                <div className="vocab-chips">{v.avoid.map(w => <span key={w} className="vocab-chip x">{w}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}

export function PageTerritorios() {
  const territories = [
    { id: '01', name: 'Cuidado', color: '#D1EDFF', body: 'Palavras que mostram atenção, presença e zelo.', words: ['zelo', 'presença', 'respiro', 'respeito', 'atenção', 'calma'] },
    { id: '02', name: 'Estrutura', color: '#E0EAFF', body: 'Palavras que falam de sistema, ordem e infraestrutura.', words: ['sistema', 'fundação', 'arquitetura', 'trilho', 'blueprint', 'matriz'] },
    { id: '03', name: 'Ofício', color: '#FFE6D5', body: 'Palavras que celebram o feito à mão, o detalhe.', words: ['ofício', 'feitura', 'detalhe', 'ajuste', 'ponto', 'afinação'] },
    { id: '04', name: 'Verdade', color: '#FFD9D9', body: 'Palavras que afirmam o que é, sem maquiar.', words: ['nítido', 'real', 'claro', 'limpo', 'honesto', 'direto'] },
  ]
  return (
    <>
      <PageHeader eyebrow="Universo Verbal · Territórios de Palavras"
        title="Quatro vizinhanças semânticas onde a marca circula."
        lede="Não use uma palavra só porque está no dicionário. Use porque ela pertence a um destes territórios." />
      <Block type="territórios">
        <div className="grid-2" style={{ gap: 18 }}>
          {territories.map(t => (
            <div key={t.id} style={{ padding: 32, background: 'var(--bg-input)', border: '0.5px solid var(--border-input)', borderRadius: 14, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: t.color, opacity: 0.08, borderRadius: '50%', transform: 'translate(40%,-40%)' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: 'var(--fg-muted)' }}>{t.id}</span>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: t.color }} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.01em' }}>{t.name}</div>
                <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 22 }}>{t.body}</div>
                <div className="vocab-chips">{t.words.map(w => <span key={w} className="vocab-chip">{w}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>
    </>
  )
}
