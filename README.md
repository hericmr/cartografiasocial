# Cartografia Social de Santos

## Sobre o Projeto

Esta é uma cartografia social que busca mapear territorialidades, lutas e conquistas dos movimentos sociais e da população na cidade de Santos. O mapa destaca a presença de equipamentos sociais, culturais, religiosos, políticos, educacionais, como escolas, unidades de saúde, assistência social, espaços culturais e de lazer, além de comunidades e locais carregados de memória e história.

Entre os elementos mapeados, estão histórias relacionadas à escravidão e lutas do povo negro, à opressão e resistência à ditadura empresarial-militar (1964-1984), e às lutas que moldaram e continuam moldando a identidade da região.

Os materiais cartográficos e textuais disponíveis aqui foram produzidos pelas(os) estudantes de Serviço Social da UNIFESP do vespertino e noturno durante a Unidade Curricular de Política Social 2, em 2024 e 2025.

### Tipos de Marcadores no Mapa

- **Azul** - Lazer: equipamentos sociais, culturais e de lazer
- **Verde** - Assistência: unidades de assistência social e saúde
- **Amarelo** - Históricos: lugares históricos e de memória
- **Vermelho** - Comunidades: territórios de comunidades
- **Violeta** - Educação: escolas e unidades de ensino
- **Preto** - Religião: estabelecimentos religiosos

## Instalação e Uso

O site é 100% estático (sem banco de dados) e é publicado no GitHub Pages.

```bash
git clone https://github.com/hericmr/cartografiasocial.git
cd cartografiasocial
npm install
npm start
```

## Como atualizar o conteúdo

Todo o conteúdo do mapa está em **`conteudo/pontos.csv`** (abre no LibreOffice ou Excel; salve como CSV UTF-8 separado por vírgula).

| Coluna | O que colocar |
|---|---|
| `id` | Deixe vazio em pontos novos: o script numera sozinho |
| `titulo` | Nome do lugar (também vira o link `?panel=`) |
| `tipo` | `assistencia`, `saude`, `historico`, `lazer`, `cultura`, `comunidades`, `educacao`, `religiao`, `bairro`... |
| `latitude`, `longitude` | Ex.: `-23.9608` e `-46.3331` (vírgula ou ponto decimal) |
| `descricao` | Texto livre; aceita `**negrito**`, `*itálico*` e quebras de linha |
| `imagens` | Separadas por `;`. Nome de um arquivo em `conteudo/fotos/` **ou** URL de uma imagem |
| `audio` | Caminho dentro de `public/`, ex.: `audio/intro.mp3` |
| `video` | URL de embed do YouTube |
| `links` | Separados por `;`. Só a URL, ou `Texto \| URL` |

Fluxo:

1. Edite `conteudo/pontos.csv`. Fotos novas: coloque o arquivo em `conteudo/fotos/` (qualquer tamanho) e escreva o nome dele na coluna `imagens`.
2. Rode:
   ```bash
   npm run conteudo
   ```
   O script valida tipos e coordenadas, converte as fotos para WebP em `public/media/`, reescreve o CSV para apontar para elas, gera `public/data/locations.json` e cria `conteudo/pendentes.csv` com os pontos sem foto ou com descrição curta.
3. Faça commit e push para `main`. O GitHub Actions confere se o JSON está atualizado (`npm run conteudo:check`), compila e publica.

O texto do painel de boas-vindas fica em `public/data/welcome.json`.

## Tecnologias

- React, MapLibre GL e Tailwind CSS
- Dados estáticos em JSON gerados a partir de CSV (`scripts/gerar-conteudo.mjs`, com sharp para as imagens)
- GitHub Actions + GitHub Pages para publicação

## Contato

Heric Rodrigues - [heric.moura@unifesp.br](mailto:heric.moura@unifesp.br)

---
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
