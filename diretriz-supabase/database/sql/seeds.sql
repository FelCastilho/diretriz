-- ============================================================================
-- Diretriz · Brand System — Seed Data
-- ----------------------------------------------------------------------------
-- Run AFTER supabase-schema.sql, triggers.sql, policies.sql.
-- Run as the postgres/service role (bypasses RLS).
--
-- Populates the master brand "LOGOTIPO" with the exact content shipped in the
-- React app: 5 sections, 20 pages, and every content collection
-- (cores, tipografia, arquétipos, personas, vocabulário, bandeiras, logos,
-- ícones, grafismos, fotografia, FAQ do assistente) plus 3 sub-brands.
--
-- Deterministic UUIDs are used for the brand and sections so the seed is
-- re-runnable and FKs stay readable. Wrapped in a transaction.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- Master brand + sub-brands
-- ----------------------------------------------------------------------------
insert into public.brands (id, slug, name, brand_type, parent_brand_id, descriptor, description, sync_status)
values
  ('00000000-0000-0000-0000-000000000001', 'logotipo', 'LOGOTIPO', 'master', null, null,
   'Brand System Diretriz — a casa viva da marca.', 'master')
on conflict (id) do nothing;

insert into public.brands (id, slug, name, brand_type, parent_brand_id, descriptor, sync_status)
values
  ('00000000-0000-0000-0000-0000000000a1', 'sub-marca-a', 'Sub-marca A', 'sub', '00000000-0000-0000-0000-000000000001', 'B2B', 'synced'),
  ('00000000-0000-0000-0000-0000000000a2', 'sub-marca-b', 'Sub-marca B', 'sub', '00000000-0000-0000-0000-000000000001', 'B2C', 'synced'),
  ('00000000-0000-0000-0000-0000000000a3', 'sub-marca-c', 'Sub-marca C', 'sub', '00000000-0000-0000-0000-000000000001', 'Regional', 'synced')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Sections (NAV_TREE)
-- ----------------------------------------------------------------------------
insert into public.sections (id, brand_id, slug, label, position) values
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'overview',   'Overview da Marca', 0),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'nucleo',     'Núcleo da Marca',   1),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'verbal',     'Universo Verbal',   2),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'visual',     'Universo Visual',   3),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', 'aplicacoes', 'Aplicações',        4)
on conflict (brand_id, slug) do nothing;

-- ----------------------------------------------------------------------------
-- Pages (20)
-- ----------------------------------------------------------------------------
insert into public.pages
  (brand_id, section_id, slug, route, label, eyebrow, title, lede, visibility, status, sync_status, version, reading_minutes, responsible, position, content_updated_at)
values
  -- Overview
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','visao','overview/visao','Visão Geral',
   'Overview · Visão Geral',
   'O ponto de partida para qualquer pessoa que toque a marca.',
   'Um percurso editorial pelo que somos, por que existimos e como nos comportamos. Tudo o que vem a seguir parte daqui.',
   'public','published','unlinked','v3.2',4,'Estúdio Diretriz',0,'2026-05-12'),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','existe','overview/existe','Por que a marca existe',
   'Overview · Por que a marca existe',
   'Toda marca começa como uma tensão entre o que é e o que poderia ser.',
   'Antes do logotipo, antes da paleta, antes do tom de voz — existe um motivo.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',1,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000010','bandeiras','overview/bandeiras','Bandeiras da Marca',
   'Overview · Bandeiras da Marca',
   'Aquilo que defendemos, mesmo quando ninguém está olhando.',
   'Bandeiras não são slogans. São compromissos públicos escritos para serem cobrados, não decorados.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',2,null),
  -- Núcleo
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000011','posicionamento','nucleo/posicionamento','Posicionamento',
   'Núcleo · Posicionamento',
   'Onde a marca decide ficar, sabendo que não pode ficar em todo lugar.',
   'Posicionamento é uma escolha de território.',
   'sso','published','unlinked','v1.0',null,'Estúdio Diretriz',0,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000011','visao','nucleo/visao','Visão e Propósito',
   'Núcleo · Visão e Propósito',
   'O futuro que perseguimos, e a razão concreta de existir hoje.',
   'Visão é onde queremos chegar. Propósito é o motivo de cada manhã.',
   'private','published','unlinked','v1.0',null,'Estúdio Diretriz',1,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000011','arquetipos','nucleo/arquetipos','Arquétipos',
   'Núcleo · Arquétipos',
   'A personalidade da marca, contada em padrões antigos.',
   'Arquétipos não engessam — orientam. Esta página define os padrões dominantes da marca.',
   'private','published','unlinked','v1.0',null,'Estúdio Diretriz',2,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000011','publico','nucleo/publico','Público-Alvo',
   'Núcleo · Público-Alvo',
   'As pessoas para quem a marca existe — descritas com cuidado, não com clichês.',
   'Personas não são fichas demográficas. São retratos vivos do contexto, do desejo e da resistência.',
   'private','published','unlinked','v1.0',null,'Estúdio Diretriz',3,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000011','arquitetura','nucleo/arquitetura','Arquitetura de Marca',
   'Núcleo · Arquitetura de Marca',
   'Como nossas marcas se conectam, e o que isso significa.',
   'A arquitetura governa hierarquia, herança visual e regras de co-branding.',
   'private','published','master','v1.0',null,'Estúdio Diretriz',4,null),
  -- Verbal
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000012','manifesto','verbal/manifesto','Manifesto',
   'Universo Verbal · Manifesto',
   'O que defendemos, dito em voz alta.',
   'O manifesto é a marca falando consigo mesma — uma declaração pública daquilo que a move.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',0,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000012','tom','verbal/tom','Tom de Voz',
   'Universo Verbal · Tom de Voz',
   'Como a marca soa — em qualquer canal, em qualquer hora.',
   'O tom é estável. O registro muda. Aqui ficam os quatro traços fixos do tom e os três registros de uso.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',1,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000012','vocabulario','verbal/vocabulario','Vocabulário',
   'Universo Verbal · Vocabulário',
   'As palavras que usamos, e as que deixamos de fora.',
   'O vocabulário é uma curadoria viva. Aqui estão os termos preferidos e os equivalentes a evitar.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',2,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000012','territorios','verbal/territorios','Territórios de Palavras',
   'Universo Verbal · Territórios de Palavras',
   'Quatro vizinhanças semânticas onde a marca circula.',
   'Não use uma palavra só porque está no dicionário. Use porque ela pertence a um destes territórios.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',3,null),
  -- Visual
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000013','logotipo','visual/logotipo','Logotipo',
   'Universo Visual · Logotipo',
   'O logotipo é a assinatura. Tratado como tal.',
   'As regras a seguir não são preferências — são as condições para que a marca seja reconhecida em qualquer aplicação.',
   'public','published','master','v1.0',null,'Estúdio Diretriz',0,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000013','cores','visual/cores','Guia de Cores',
   'Universo Visual · Guia de Cores',
   'Toda cor é uma decisão. Aqui ficam as nossas.',
   'Clique em qualquer amostra para copiar. As cores estão organizadas em primárias e secundárias.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',1,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000013','tipografia','visual/tipografia','Tipografia',
   'Universo Visual · Tipografia',
   'Uma família, dois pesos, sem exceções.',
   'A marca usa Inter em Medium (500) e Semibold (600) apenas.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',2,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000013','grafismos','visual/grafismos','Grafismos',
   'Universo Visual · Grafismos',
   'Elementos gráficos auxiliares — ritmo, textura, respiro.',
   'Grafismos não são logotipos. São tijolos visuais que constroem o sistema.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',3,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000013','iconografia','visual/iconografia','Iconografia',
   'Universo Visual · Iconografia',
   'Pictogramas geométricos, com 1,5px de traço — uniformes.',
   'A marca usa ícones de linha, com cantos retos e ângulos a 0/45/90º.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',4,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000013','foto','visual/foto','Estilo Fotográfico',
   'Universo Visual · Estilo Fotográfico',
   'Imagens cinematográficas, levemente desaturadas, sempre frias.',
   'A fotografia da marca recusa o calor exagerado e a saturação artificial. Procura presença, não pose.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',5,null),
  -- Aplicações
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000014','papelaria','aplicacoes/papelaria','Papelaria Institucional',
   'Aplicações · Papelaria Institucional',
   'A marca em papel — cartão, carta, envelope, assinatura.',
   'Onde o sistema encontra o ofício gráfico. Os templates abaixo são editáveis — baixe, abra no software indicado, preencha.',
   'public','published','unlinked','v1.0',null,'Estúdio Diretriz',0,null),
  ('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000014','digital','aplicacoes/digital','Presença Digital',
   'Aplicações · Presença Digital',
   'A marca nas telas — site, redes, app, e-mail.',
   'Os templates abaixo são vivos: alterações na Marca Mestre propagam aqui automaticamente.',
   'public','published','master','v1.0',null,'Estúdio Diretriz',1,null)
on conflict (brand_id, route) do nothing;

-- ----------------------------------------------------------------------------
-- Page tags
-- ----------------------------------------------------------------------------
insert into public.page_tags (page_id, label, variant, position)
select id, 'Público · acesso aberto', null, 0 from public.pages where route = 'overview/visao'
union all select id, 'Privado · SSO', 'private', 0 from public.pages where route = 'nucleo/posicionamento'
union all select id, 'Sincronizado · Marca Mestre', 'synced', 0 from public.pages where route = 'nucleo/arquitetura'
union all select id, 'Sincronizado · Mestre', 'synced', 0 from public.pages where route = 'visual/logotipo'
union all select id, 'Sincronizado · 4 ativos', 'synced', 0 from public.pages where route = 'aplicacoes/digital';

-- ----------------------------------------------------------------------------
-- Colors (Guia de Cores)
-- ----------------------------------------------------------------------------
insert into public.colors (brand_id, name, hex, rgb, cmyk, pantone, palette, usage_percentage, position) values
  ('00000000-0000-0000-0000-000000000001','Tinta 01', '#0D0D0D','13 · 13 · 13','0 / 0 / 0 / 95','Black 6 C','primary',60,0),
  ('00000000-0000-0000-0000-000000000001','Papel 01', '#FAF9FA','250 · 249 · 250','0 / 1 / 0 / 2','Off White','primary',25,1),
  ('00000000-0000-0000-0000-000000000001','Acento 01','#D1EDFF','209 · 237 · 255','18 / 7 / 0 / 0','656 C','primary',10,2),
  ('00000000-0000-0000-0000-000000000001','Pedra',    '#262626','38 · 38 · 38','0 / 0 / 0 / 85','Black 4 C','secondary',5,3),
  ('00000000-0000-0000-0000-000000000001','Névoa',    '#A3A3A3','163 · 163 · 163','0 / 0 / 0 / 36','Cool Gray 6 C','secondary',null,4),
  ('00000000-0000-0000-0000-000000000001','Areia',    '#E8E0D5','232 · 224 · 213','0 / 3 / 8 / 9','7527 C','secondary',null,5),
  ('00000000-0000-0000-0000-000000000001','Musgo',    '#4A5A4A','74 · 90 · 74','18 / 0 / 18 / 65','5605 C','secondary',null,6),
  ('00000000-0000-0000-0000-000000000001','Ferrugem', '#B4654A','180 · 101 · 74','0 / 44 / 59 / 29','7593 C','secondary',null,7);

-- Approved contrast combinations
insert into public.color_combinations (brand_id, label, foreground_hex, background_hex, contrast_ratio, wcag_level, position) values
  ('00000000-0000-0000-0000-000000000001','Padrão dark',        '#FAF9FA','#0D0D0D','20.5:1','AAA',0),
  ('00000000-0000-0000-0000-000000000001','Padrão light',       '#0D0D0D','#FAF9FA','20.5:1','AAA',1),
  ('00000000-0000-0000-0000-000000000001','Acento sobre claro', '#0D0D0D','#D1EDFF','16.2:1','AAA',2),
  ('00000000-0000-0000-0000-000000000001','Superfície dark',    '#FAF9FA','#262626','12.6:1','AAA',3),
  ('00000000-0000-0000-0000-000000000001','Acento sobre escuro','#D1EDFF','#0D0D0D','16.4:1','AAA',4),
  ('00000000-0000-0000-0000-000000000001','Texto secundário',   '#A3A3A3','#0D0D0D','7.8:1', 'AAA',5);

-- ----------------------------------------------------------------------------
-- Typography
-- ----------------------------------------------------------------------------
insert into public.typography_families (id, brand_id, name, classification, source, license, is_primary, position) values
  ('00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000001','Inter','Sans-serif · variável · Open source','rsms.me/inter','SIL Open Font License',true,0);

insert into public.typography_weights (family_id, weight_value, weight_name, usage, position) values
  ('00000000-0000-0000-0000-000000000020',500,'Medium','corpo e labels',0),
  ('00000000-0000-0000-0000-000000000020',600,'Semibold','títulos e destaques',1);

insert into public.typography_specimens (brand_id, label, weight, size, tracking, sample_text, font_px, position) values
  ('00000000-0000-0000-0000-000000000001','Display','Semibold · 600','72px / 1.02','-0.025em','Manhãs novas, decisões precisas.',72,0),
  ('00000000-0000-0000-0000-000000000001','H1 · Título de página','Semibold · 600','48px / 1.05','-0.02em','Onde a marca se planta.',48,1),
  ('00000000-0000-0000-0000-000000000001','H2 · Subtítulo','Semibold · 600','32px / 1.15','-0.015em','Quatro traços fixos do tom.',32,2),
  ('00000000-0000-0000-0000-000000000001','Lede','Medium · 500','20px / 1.45','0','Um percurso editorial pelo que somos, por que existimos e como nos comportamos.',20,3),
  ('00000000-0000-0000-0000-000000000001','Body','Medium · 500','16px / 1.6','0','Esta é a casa viva da marca. Não é um PDF estático que envelhece em um drive.',16,4),
  ('00000000-0000-0000-0000-000000000001','Caption','Medium · 500','12px / 1.4','0.02em','Última atualização · 12 maio 2026',12,5);

-- ----------------------------------------------------------------------------
-- Archetypes
-- ----------------------------------------------------------------------------
insert into public.archetypes (brand_id, name, body, is_primary, percentage, color_hex, position) values
  ('00000000-0000-0000-0000-000000000001','Sábio','Busca a verdade, ensina, decodifica complexidade.',true,60,'#D1EDFF',0),
  ('00000000-0000-0000-0000-000000000001','Criador','Trabalha com originalidade e ofício.',false,null,'#E8E0FF',1),
  ('00000000-0000-0000-0000-000000000001','Explorador','Procura o que ainda não foi visto.',false,null,'#FFE6D5',2);

-- ----------------------------------------------------------------------------
-- Brand values
-- ----------------------------------------------------------------------------
insert into public.brand_values (brand_id, name, position) values
  ('00000000-0000-0000-0000-000000000001','Verdade',0),
  ('00000000-0000-0000-0000-000000000001','Foco',1),
  ('00000000-0000-0000-0000-000000000001','Generosidade',2),
  ('00000000-0000-0000-0000-000000000001','Rigor',3),
  ('00000000-0000-0000-0000-000000000001','Curiosidade',4),
  ('00000000-0000-0000-0000-000000000001','Cuidado',5);

-- ----------------------------------------------------------------------------
-- Personas
-- ----------------------------------------------------------------------------
insert into public.personas (brand_id, tier, role_label, nickname, wants, fears, position) values
  ('00000000-0000-0000-0000-000000000001','primary','Persona Primária','[Apelido descritivo]',
   '[O que essa pessoa quer alcançar — o desejo profundo, não o pedido superficial.]',
   '[O que ela teme — a resistência que precisamos endereçar.]',0),
  ('00000000-0000-0000-0000-000000000001','secondary','Persona Secundária','[Apelido descritivo]','[Desejo.]','[Medo.]',1),
  ('00000000-0000-0000-0000-000000000001','tertiary','Persona Terciária','[Apelido descritivo]','[Desejo.]','[Medo.]',2);

-- ----------------------------------------------------------------------------
-- Positioning
-- ----------------------------------------------------------------------------
insert into public.positioning_statements (brand_id, audience, tension, category, benefit, reason_to_believe, statement_template) values
  ('00000000-0000-0000-0000-000000000001','[público-alvo]','[tensão central]','[categoria]','[benefício único]','[razão para acreditar]',
   'Para [público-alvo] que enfrenta [tensão central], a LOGOTIPO é a [categoria] que oferece [benefício único], porque [razão para acreditar].');

insert into public.positioning_pillars (brand_id, title, body, linked_route, position) values
  ('00000000-0000-0000-0000-000000000001','Público-Alvo','Quem precisa de nós e por que.','nucleo/publico',0),
  ('00000000-0000-0000-0000-000000000001','Tensão Central','O problema mal resolvido que justifica nossa existência.',null,1),
  ('00000000-0000-0000-0000-000000000001','Benefício Único','Aquilo que entregamos que ninguém entrega do mesmo jeito.',null,2),
  ('00000000-0000-0000-0000-000000000001','Razão para Crer','As provas concretas que sustentam a promessa.',null,3);

-- Competitive map
insert into public.competitors (brand_id, label, axis_x, axis_y, is_self, position) values
  ('00000000-0000-0000-0000-000000000001','Concorrente A',25,70,false,0),
  ('00000000-0000-0000-0000-000000000001','Concorrente B',70,30,false,1),
  ('00000000-0000-0000-0000-000000000001','Concorrente C',50,50,false,2),
  ('00000000-0000-0000-0000-000000000001','LOGOTIPO',78,78,true,3);

-- ----------------------------------------------------------------------------
-- Tone of voice
-- ----------------------------------------------------------------------------
insert into public.voice_traits (brand_id, name, body, position) values
  ('00000000-0000-0000-0000-000000000001','Direto','Vai ao ponto. Frase curta, verbo no presente, sujeito implícito quando óbvio.',0),
  ('00000000-0000-0000-0000-000000000001','Calmo','Não usa exclamação. Não dramatiza. Não força urgência onde não há.',1),
  ('00000000-0000-0000-0000-000000000001','Específico','Prefere o número ao ''muito''. O exemplo ao adjetivo. A regra ao ''em geral''.',2),
  ('00000000-0000-0000-0000-000000000001','Editorial','Tem ritmo. Quebra frases longas. Usa o ponto como ferramenta de respiração.',3);

insert into public.voice_examples (brand_id, do_text, dont_text, position) values
  ('00000000-0000-0000-0000-000000000001','Acesse o sistema com seu e-mail corporativo.','Faça o seu login agora mesmo com a sua conta corporativa!',0),
  ('00000000-0000-0000-0000-000000000001','Você pode editar este bloco. Basta clicar.','Que tal editar este bloco? É super fácil 🎨',1),
  ('00000000-0000-0000-0000-000000000001','Atualizamos a paleta. Veja o que mudou em Cores.','UAU! A paleta foi atualizada e está incrível!',2),
  ('00000000-0000-0000-0000-000000000001','Esta página é privada. Solicite acesso à equipe.','Sorry, esta página é privada... 😅',3);

insert into public.voice_registers (brand_id, register, name, usage, example, position) values
  ('00000000-0000-0000-0000-000000000001','institucional','Institucional','Site, documentação, comunicados oficiais.','A marca opera em quatro mercados regulados pela ANVISA.',0),
  ('00000000-0000-0000-0000-000000000001','conversacional','Conversacional','Redes sociais, e-mails de produto, FAQs.','Você pode trocar a senha pelo botão no canto.',1),
  ('00000000-0000-0000-0000-000000000001','editorial','Editorial','Manifesto, brand story, conteúdo de marca.','Acreditamos que diretrizes vivem melhor quando podem respirar.',2);

-- ----------------------------------------------------------------------------
-- Vocabulary (normalized)
-- ----------------------------------------------------------------------------
insert into public.vocabulary_categories (id, brand_id, name, position) values
  ('00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000001','Produto',0),
  ('00000000-0000-0000-0000-000000000031','00000000-0000-0000-0000-000000000001','Pessoas',1),
  ('00000000-0000-0000-0000-000000000032','00000000-0000-0000-0000-000000000001','Ações',2),
  ('00000000-0000-0000-0000-000000000033','00000000-0000-0000-0000-000000000001','Hierarquia',3),
  ('00000000-0000-0000-0000-000000000034','00000000-0000-0000-0000-000000000001','Conteúdo',4)
on conflict (brand_id, name) do nothing;

insert into public.vocabulary_words (category_id, word, kind, position) values
  ('00000000-0000-0000-0000-000000000030','sistema','use',0),
  ('00000000-0000-0000-0000-000000000030','plataforma','use',1),
  ('00000000-0000-0000-0000-000000000030','diretriz','use',2),
  ('00000000-0000-0000-0000-000000000030','app','avoid',0),
  ('00000000-0000-0000-0000-000000000030','solução','avoid',1),
  ('00000000-0000-0000-0000-000000000030','ferramenta','avoid',2),
  ('00000000-0000-0000-0000-000000000031','pessoa usuária','use',0),
  ('00000000-0000-0000-0000-000000000031','equipe','use',1),
  ('00000000-0000-0000-0000-000000000031','responsável','use',2),
  ('00000000-0000-0000-0000-000000000031','consumidor','avoid',0),
  ('00000000-0000-0000-0000-000000000031','user','avoid',1),
  ('00000000-0000-0000-0000-000000000031','colaborador','avoid',2),
  ('00000000-0000-0000-0000-000000000032','acessar','use',0),
  ('00000000-0000-0000-0000-000000000032','atualizar','use',1),
  ('00000000-0000-0000-0000-000000000032','publicar','use',2),
  ('00000000-0000-0000-0000-000000000032','logar','avoid',0),
  ('00000000-0000-0000-0000-000000000032','subir','avoid',1),
  ('00000000-0000-0000-0000-000000000032','deployar','avoid',2),
  ('00000000-0000-0000-0000-000000000033','marca mestre','use',0),
  ('00000000-0000-0000-0000-000000000033','sub-marca','use',1),
  ('00000000-0000-0000-0000-000000000033','ativo','use',2),
  ('00000000-0000-0000-0000-000000000033','marca-mãe','avoid',0),
  ('00000000-0000-0000-0000-000000000033','filha','avoid',1),
  ('00000000-0000-0000-0000-000000000033','asset','avoid',2),
  ('00000000-0000-0000-0000-000000000034','bloco','use',0),
  ('00000000-0000-0000-0000-000000000034','página','use',1),
  ('00000000-0000-0000-0000-000000000034','módulo','use',2),
  ('00000000-0000-0000-0000-000000000034','card','avoid',0),
  ('00000000-0000-0000-0000-000000000034','screen','avoid',1),
  ('00000000-0000-0000-0000-000000000034','widget','avoid',2);

-- ----------------------------------------------------------------------------
-- Word territories (normalized)
-- ----------------------------------------------------------------------------
insert into public.word_territories (id, brand_id, name, color_hex, body, position) values
  ('00000000-0000-0000-0000-000000000040','00000000-0000-0000-0000-000000000001','Cuidado','#D1EDFF','Palavras que mostram atenção, presença e zelo.',0),
  ('00000000-0000-0000-0000-000000000041','00000000-0000-0000-0000-000000000001','Estrutura','#E0EAFF','Palavras que falam de sistema, ordem e infraestrutura.',1),
  ('00000000-0000-0000-0000-000000000042','00000000-0000-0000-0000-000000000001','Ofício','#FFE6D5','Palavras que celebram o feito à mão, o detalhe.',2),
  ('00000000-0000-0000-0000-000000000043','00000000-0000-0000-0000-000000000001','Verdade','#FFD9D9','Palavras que afirmam o que é, sem maquiar.',3);

insert into public.word_territory_words (territory_id, word, position) values
  ('00000000-0000-0000-0000-000000000040','zelo',0),('00000000-0000-0000-0000-000000000040','presença',1),
  ('00000000-0000-0000-0000-000000000040','respiro',2),('00000000-0000-0000-0000-000000000040','respeito',3),
  ('00000000-0000-0000-0000-000000000040','atenção',4),('00000000-0000-0000-0000-000000000040','calma',5),
  ('00000000-0000-0000-0000-000000000041','sistema',0),('00000000-0000-0000-0000-000000000041','fundação',1),
  ('00000000-0000-0000-0000-000000000041','arquitetura',2),('00000000-0000-0000-0000-000000000041','trilho',3),
  ('00000000-0000-0000-0000-000000000041','blueprint',4),('00000000-0000-0000-0000-000000000041','matriz',5),
  ('00000000-0000-0000-0000-000000000042','ofício',0),('00000000-0000-0000-0000-000000000042','feitura',1),
  ('00000000-0000-0000-0000-000000000042','detalhe',2),('00000000-0000-0000-0000-000000000042','ajuste',3),
  ('00000000-0000-0000-0000-000000000042','ponto',4),('00000000-0000-0000-0000-000000000042','afinação',5),
  ('00000000-0000-0000-0000-000000000043','nítido',0),('00000000-0000-0000-0000-000000000043','real',1),
  ('00000000-0000-0000-0000-000000000043','claro',2),('00000000-0000-0000-0000-000000000043','limpo',3),
  ('00000000-0000-0000-0000-000000000043','honesto',4),('00000000-0000-0000-0000-000000000043','direto',5);

-- ----------------------------------------------------------------------------
-- Manifesto
-- ----------------------------------------------------------------------------
insert into public.manifestos (brand_id, page_id, body, signed_by, signed_year)
select
  '00000000-0000-0000-0000-000000000001', p.id,
  E'A cada nova manhã, alguém em algum lugar do mundo precisa de uma decisão tomada com clareza. Não pela pressa, mas pelo cuidado.\n\n'
  || E'Acreditamos que a forma como uma marca aparece — a palavra que escolhe, a cor que carrega — é, ela mesma, uma decisão.\n\n'
  || E'Por isso existimos: para que diretrizes deixem de ser PDFs perdidos em drives, e passem a ser estruturas que respiram com a marca.\n\n'
  || E'Não fazemos manuais. Fazemos sistemas que ensinam outras pessoas a tomar boas decisões — mesmo quando ninguém está olhando.\n\n'
  || E'E acreditamos, antes de tudo, que uma marca bem cuidada por dentro é uma marca confiável por fora.',
  'time fundador', 2024
from public.pages p where p.route = 'verbal/manifesto';

-- ----------------------------------------------------------------------------
-- Flags (Bandeiras)
-- ----------------------------------------------------------------------------
insert into public.flags (brand_id, number, title, body, is_verifiable, updated_label, position) values
  ('00000000-0000-0000-0000-000000000001','01','Compromisso','[Descreva a primeira bandeira — um compromisso público que a marca defende, mesmo quando dá trabalho.]',true,'Atualizada · 04/26',0),
  ('00000000-0000-0000-0000-000000000001','02','Compromisso','[Descreva a segunda bandeira — algo que diferencia esta marca das demais no mercado.]',true,'Atualizada · 04/26',1),
  ('00000000-0000-0000-0000-000000000001','03','Compromisso','[Descreva a terceira bandeira — uma promessa concreta que orienta decisões diárias.]',true,'Atualizada · 04/26',2),
  ('00000000-0000-0000-0000-000000000001','04','Compromisso','[Quarta bandeira — opcional. Mantenha entre 3 e 5 no total.]',true,'Atualizada · 04/26',3);

-- ----------------------------------------------------------------------------
-- Logos + misuse + min sizes
-- ----------------------------------------------------------------------------
insert into public.logos (brand_id, name, description, is_primary, position) values
  ('00000000-0000-0000-0000-000000000001','Logotipo Primário','Para fundos escuros · padrão',true,0),
  ('00000000-0000-0000-0000-000000000001','Logotipo Mono · Preto','Para fundos claros · alto contraste',false,1),
  ('00000000-0000-0000-0000-000000000001','Símbolo · Reduzido','Favicon, ícone de app, avatar',false,2);

insert into public.logo_misuses (brand_id, label, position) values
  ('00000000-0000-0000-0000-000000000001','Não rotacione',0),
  ('00000000-0000-0000-0000-000000000001','Não estique',1),
  ('00000000-0000-0000-0000-000000000001','Não troque a cor',2),
  ('00000000-0000-0000-0000-000000000001','Não aplique sombra',3),
  ('00000000-0000-0000-0000-000000000001','Não use sobre cor saturada',4),
  ('00000000-0000-0000-0000-000000000001','Não esprema o respiro',5);

insert into public.logo_min_sizes (brand_id, context, min_size, body, position) values
  ('00000000-0000-0000-0000-000000000001','Digital','120px largura','Telas: web, app, embeds.',0),
  ('00000000-0000-0000-0000-000000000001','Impressão','24mm largura','Papelaria, sinalização, peças impressas.',1),
  ('00000000-0000-0000-0000-000000000001','Bordado / Gravado','40mm largura','Têxteis e ofícios — pede mais respiro.',2);

-- ----------------------------------------------------------------------------
-- Graphics (Grafismos)
-- ----------------------------------------------------------------------------
insert into public.graphics (brand_id, name, position) values
  ('00000000-0000-0000-0000-000000000001','Hairline',0),
  ('00000000-0000-0000-0000-000000000001','Quadrante',1),
  ('00000000-0000-0000-0000-000000000001','Bolha',2),
  ('00000000-0000-0000-0000-000000000001','Anel',3),
  ('00000000-0000-0000-0000-000000000001','Grid 3×3',4),
  ('00000000-0000-0000-0000-000000000001','Seta',5),
  ('00000000-0000-0000-0000-000000000001','Asterisco',6),
  ('00000000-0000-0000-0000-000000000001','Diagonal',7);

-- ----------------------------------------------------------------------------
-- Icons (Iconografia)
-- ----------------------------------------------------------------------------
insert into public.icons (brand_id, name, position) values
  ('00000000-0000-0000-0000-000000000001','search',0),
  ('00000000-0000-0000-0000-000000000001','users',1),
  ('00000000-0000-0000-0000-000000000001','download',2),
  ('00000000-0000-0000-0000-000000000001','share',3),
  ('00000000-0000-0000-0000-000000000001','lock',4),
  ('00000000-0000-0000-0000-000000000001','edit',5),
  ('00000000-0000-0000-0000-000000000001','eye',6),
  ('00000000-0000-0000-0000-000000000001','plus',7),
  ('00000000-0000-0000-0000-000000000001','check',8),
  ('00000000-0000-0000-0000-000000000001','x',9),
  ('00000000-0000-0000-0000-000000000001','image',10),
  ('00000000-0000-0000-0000-000000000001','link',11),
  ('00000000-0000-0000-0000-000000000001','layers',12),
  ('00000000-0000-0000-0000-000000000001','play',13),
  ('00000000-0000-0000-0000-000000000001','sparkle',14),
  ('00000000-0000-0000-0000-000000000001','moon',15)
on conflict (brand_id, name) do nothing;

-- ----------------------------------------------------------------------------
-- Photography
-- ----------------------------------------------------------------------------
insert into public.photography_references (brand_id, label, aspect_ratio, layout_span, position) values
  ('00000000-0000-0000-0000-000000000001','Imagem-referência · paisagem ampla','2','wide',0),
  ('00000000-0000-0000-0000-000000000001','Retrato · luz lateral','1',null,1),
  ('00000000-0000-0000-0000-000000000001','Detalhe · textura','1',null,2),
  ('00000000-0000-0000-0000-000000000001','Objeto · espaço vazio','1',null,3),
  ('00000000-0000-0000-0000-000000000001','Vertical · figura humana','1/2','tall',4),
  ('00000000-0000-0000-0000-000000000001','Paisagem · cor fria','1',null,5),
  ('00000000-0000-0000-0000-000000000001','Macro · grão visível','1',null,6),
  ('00000000-0000-0000-0000-000000000001','Arquitetura','1',null,7);

insert into public.photography_params (brand_id, key, value, note, position) values
  ('00000000-0000-0000-0000-000000000001','Temperatura','5600K – 6500K','Frio para neutro. Nunca quente.',0),
  ('00000000-0000-0000-0000-000000000001','Saturação','−15% a −25%','Sempre dessaturado em relação ao RAW.',1),
  ('00000000-0000-0000-0000-000000000001','Contraste','Médio','Sombras visíveis · highlights preservados.',2),
  ('00000000-0000-0000-0000-000000000001','Grão','Sutil · 18 ISO equiv.','Aceitável · evita o look digital.',3),
  ('00000000-0000-0000-0000-000000000001','Proporções','4:5 · 3:2 · 16:9','Quadrado só em redes sociais.',4),
  ('00000000-0000-0000-0000-000000000001','Profundidade','f/2.8 – f/5.6','Foco seletivo.',5);

-- ----------------------------------------------------------------------------
-- Assets + downloadable files (DownloadRow library)
-- ----------------------------------------------------------------------------
insert into public.assets (id, brand_id, kind, title, description) values
  ('00000000-0000-0000-0000-000000000050','00000000-0000-0000-0000-000000000001','logo','Logotipo Primário','Para fundos escuros · padrão'),
  ('00000000-0000-0000-0000-000000000051','00000000-0000-0000-0000-000000000001','logo','Logotipo Mono · Preto','Para fundos claros · alto contraste'),
  ('00000000-0000-0000-0000-000000000052','00000000-0000-0000-0000-000000000001','logo','Símbolo · Reduzido','Favicon, ícone de app, avatar'),
  ('00000000-0000-0000-0000-000000000053','00000000-0000-0000-0000-000000000001','font','Inter · família completa','OTF, WOFF2, variable'),
  ('00000000-0000-0000-0000-000000000054','00000000-0000-0000-0000-000000000001','graphic','Biblioteca de grafismos · SVG','8 elementos · 1 arquivo .zip'),
  ('00000000-0000-0000-0000-000000000055','00000000-0000-0000-0000-000000000001','graphic','Padrão diagonal · pattern','Para fundos extensos · repetível'),
  ('00000000-0000-0000-0000-000000000056','00000000-0000-0000-0000-000000000001','icon','Pacote completo · 64 ícones','SVG individuais + Figma library'),
  ('00000000-0000-0000-0000-000000000057','00000000-0000-0000-0000-000000000001','icon','Sprite SVG','1 arquivo, todos os ícones com IDs'),
  ('00000000-0000-0000-0000-000000000058','00000000-0000-0000-0000-000000000001','template','Cartão de visita · template','Frente e verso · com sangria'),
  ('00000000-0000-0000-0000-000000000059','00000000-0000-0000-0000-000000000001','template','Assinatura de e-mail','HTML pronto · Gmail, Outlook'),
  ('00000000-0000-0000-0000-00000000005a','00000000-0000-0000-0000-000000000001','document','Carta institucional','A4 · editável'),
  ('00000000-0000-0000-0000-00000000005b','00000000-0000-0000-0000-000000000001','template','Pacote redes sociais · Figma','14 templates · 4 formatos'),
  ('00000000-0000-0000-0000-00000000005c','00000000-0000-0000-0000-000000000001','template','Site · template Figma','6 telas · variáveis sincronizadas'),
  ('00000000-0000-0000-0000-00000000005d','00000000-0000-0000-0000-000000000001','template','App · UI kit','Componentes + tokens'),
  ('00000000-0000-0000-0000-00000000005e','00000000-0000-0000-0000-000000000001','template','E-mail transacional · HTML','5 templates · pronto para integração');

insert into public.asset_files (asset_id, format, is_primary, position) values
  ('00000000-0000-0000-0000-000000000050','SVG',true,0),
  ('00000000-0000-0000-0000-000000000050','PNG',false,1),
  ('00000000-0000-0000-0000-000000000050','PDF',false,2),
  ('00000000-0000-0000-0000-000000000051','SVG',true,0),
  ('00000000-0000-0000-0000-000000000051','PNG',false,1),
  ('00000000-0000-0000-0000-000000000052','SVG',true,0),
  ('00000000-0000-0000-0000-000000000052','PNG',false,1),
  ('00000000-0000-0000-0000-000000000052','ICO',false,2),
  ('00000000-0000-0000-0000-000000000053','OTF',true,0),
  ('00000000-0000-0000-0000-000000000053','WOFF2',false,1),
  ('00000000-0000-0000-0000-000000000054','SVG',true,0),
  ('00000000-0000-0000-0000-000000000054','ZIP',false,1),
  ('00000000-0000-0000-0000-000000000055','SVG',true,0),
  ('00000000-0000-0000-0000-000000000055','PNG',false,1),
  ('00000000-0000-0000-0000-000000000056','ZIP',true,0),
  ('00000000-0000-0000-0000-000000000056','FIG',false,1),
  ('00000000-0000-0000-0000-000000000057','SVG',true,0),
  ('00000000-0000-0000-0000-000000000058','PDF',true,0),
  ('00000000-0000-0000-0000-000000000058','AI',false,1),
  ('00000000-0000-0000-0000-000000000058','INDD',false,2),
  ('00000000-0000-0000-0000-000000000059','HTML',true,0),
  ('00000000-0000-0000-0000-000000000059','ZIP',false,1),
  ('00000000-0000-0000-0000-00000000005a','PDF',true,0),
  ('00000000-0000-0000-0000-00000000005a','DOCX',false,1),
  ('00000000-0000-0000-0000-00000000005b','FIG',true,0),
  ('00000000-0000-0000-0000-00000000005b','ZIP',false,1),
  ('00000000-0000-0000-0000-00000000005c','FIG',true,0),
  ('00000000-0000-0000-0000-00000000005c','PDF',false,1),
  ('00000000-0000-0000-0000-00000000005d','FIG',true,0),
  ('00000000-0000-0000-0000-00000000005e','HTML',true,0),
  ('00000000-0000-0000-0000-00000000005e','ZIP',false,1);

-- ----------------------------------------------------------------------------
-- Embeds
-- ----------------------------------------------------------------------------
insert into public.embeds (brand_id, kind, title, url, position)
select '00000000-0000-0000-0000-000000000001','Vídeo','Manifesto · entrevista de 4 minutos','vimeo.com/diretriz/manifesto',0;

-- ----------------------------------------------------------------------------
-- Quick answers (AI assistant · SearchModal)
-- ----------------------------------------------------------------------------
insert into public.quick_answers (id, brand_id, question, answer, position) values
  ('00000000-0000-0000-0000-000000000060','00000000-0000-0000-0000-000000000001',
   'Quais são as regras para patrocínios?',
   'Patrocínios seguem a hierarquia da Arquitetura de Marca — o LOGOTIPO sempre aparece à esquerda, em ≥1,5x a altura do parceiro.',0),
  ('00000000-0000-0000-0000-000000000061','00000000-0000-0000-0000-000000000001',
   'Onde baixo o logotipo em SVG?',
   'Vá em Universo Visual › Logotipo, seção Arquivos. Cada variante tem botão de download em SVG, PNG e PDF.',1),
  ('00000000-0000-0000-0000-000000000062','00000000-0000-0000-0000-000000000001',
   'Qual é o tom de voz em peças formais?',
   'Em peças institucionais, o tom é direto, calmo — sem exclamações nem emoji. Frases curtas, verbo no imperativo.',2);

insert into public.quick_answer_citations (quick_answer_id, label, route, position) values
  ('00000000-0000-0000-0000-000000000060','Logotipo · Co-branding','visual/logotipo',0),
  ('00000000-0000-0000-0000-000000000060','Arquitetura de Marca','nucleo/arquitetura',1),
  ('00000000-0000-0000-0000-000000000061','Logotipo · Arquivos','visual/logotipo',0),
  ('00000000-0000-0000-0000-000000000062','Tom de Voz','verbal/tom',0);

-- Link the master brand's logo asset.
update public.brands
  set logo_asset_id = '00000000-0000-0000-0000-000000000050'
  where id = '00000000-0000-0000-0000-000000000001';

commit;

-- ============================================================================
-- End of seeds.sql
-- ============================================================================
