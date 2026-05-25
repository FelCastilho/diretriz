# Diretriz · Brand System

Aplicativo React do Brand System Diretriz, pronto para rodar no VS Code com Vite.

## Requisitos

- Node.js 18+ instalado

## Como rodar

```bash
# 1. Entre na pasta
cd diretriz

# 2. Instale as dependências (só na primeira vez)
npm install

# 3. Rode o servidor de desenvolvimento
npm run dev
```

Abra **http://localhost:5173** no navegador.

---

## Estrutura de pastas

```
diretriz/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # entry point
    ├── App.jsx               # roteamento e estado global
    ├── styles/
    │   ├── tokens.css        # design tokens (cores, tipos, espaços)
    │   └── app.css           # estilos de layout e componentes
    └── components/
    │   ├── Icons.jsx         # 22 ícones SVG inline
    │   ├── Atoms.jsx         # BrandMark, Toast, Tag, Banner, Block,
    │   │                     # ColorSwatch, DownloadRow, PageHeader…
    │   └── Chrome.jsx        # Sidebar, Topbar, SearchModal,
    │                         # SettingsModal, EditToolbar, LoggedOutScreen
    └── pages/
        ├── Overview.jsx      # Visão Geral, Por que existe, Bandeiras
        ├── Nucleo.jsx        # Posicionamento, Visão/Propósito, Arquétipos,
        │                     # Público-Alvo, Arquitetura de Marca
        ├── Verbal.jsx        # Manifesto, Tom de Voz, Vocabulário, Territórios
        ├── Visual.jsx        # Logotipo, Cores, Tipografia, Grafismos,
        │                     # Iconografia, Fotografia
        └── Aplicacoes.jsx    # Papelaria Institucional, Presença Digital
```

## Features

- **20 páginas** com conteúdo real
- **Sidebar** accordion com scroll e user menu
- **⌘K** busca com Assistente IA mockado
- **Toggle dark/light** — temas completos
- **Modo Editar** com Edit Toolbar flutuante
- **Configurações de perfil** com upload de foto
- **ColorSwatch** click-to-copy (HEX, RGB, CMYK, PMS)
- **Toast** feedback para downloads e cópia

## Para personalizar

- Troque `BRAND_NAME` em `src/components/Atoms.jsx`
- Edite os tokens de cor em `src/styles/tokens.css`
- Adicione páginas em `src/pages/` e registre em `src/App.jsx`
