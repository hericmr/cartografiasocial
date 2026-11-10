// Gera public/data/locations.json a partir de conteudo/pontos.csv.
//
// - Fotos novas (arquivo em conteudo/fotos/ ou URL) são convertidas para WebP em
//   public/media/ e a célula do CSV é reescrita para apontar para o arquivo gerado.
// - Pontos sem id recebem o próximo número livre.
// - Valida tipo e coordenadas e gera conteudo/pendentes.csv com o que falta preencher.
//
// uso: npm run conteudo            (gera e reescreve o CSV)
//      npm run conteudo -- --check (só valida; falha se o JSON estiver desatualizado)

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import sharp from "sharp";
import slugify from "slugify";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CSV = path.join(ROOT, "conteudo/pontos.csv");
const FOTOS = path.join(ROOT, "conteudo/fotos");
const PUBLIC = path.join(ROOT, "public");
const MEDIA = path.join(PUBLIC, "media");
const JSON_OUT = path.join(PUBLIC, "data/locations.json");
const PENDENTES = path.join(ROOT, "conteudo/pendentes.csv");
const BASE = "/cartografiasocial";
const SITE = "https://hericmr.github.io/cartografiasocial";
const MAX_WIDTH = 1600;
const DESCRICAO_MINIMA = 150;
const CHECK = process.argv.includes("--check");

const COLUNAS = ["id", "titulo", "tipo", "latitude", "longitude", "descricao", "imagens", "creditos", "audio", "video", "links"];
// Colunas acrescentadas depois: podem faltar em CSVs antigos
const OPCIONAIS = ["creditos"];

// Mesmo mapeamento de src/components/categorias.js (tipos aceitos no CSV)
const TIPOS = {
  assistencia: "Assistência", saude: "Saúde", historico: "Histórico", "patrimonio historico": "Histórico",
  "marco historico": "Histórico", "historico / fonte": "Histórico", fortificacao: "Histórico",
  engenharia: "Histórico", comunidades: "Comunidades", ilha: "Comunidades", educacao: "Educação",
  religiao: "Religião", religioso: "Religião", igreja: "Religião", bairro: "Bairro",
  lazer: "Lazer e cultura", cultura: "Lazer e cultura", cultural: "Lazer e cultura", turismo: "Lazer e cultura",
  museu: "Lazer e cultura", monumento: "Lazer e cultura", memorial: "Lazer e cultura", esporte: "Lazer e cultura",
  "cultura / teatro": "Lazer e cultura", "esportivo / cultural": "Lazer e cultura", "mirante / esporte": "Lazer e cultura",
};

const normalizar = (t) => (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
const lista = (celula) => (celula || "").split(";").map((s) => s.trim()).filter(Boolean);
const textoPuro = (html) => (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const slugPainel = (titulo) => slugify(titulo, { lower: true, remove: /[*+~.()'"!:@]/g });
const slugArquivo = (titulo) => slugify(titulo, { lower: true, strict: true }).slice(0, 40) || "foto";

const erros = [];
const avisos = [];

async function baixar(url, tentativa = 1) {
  const res = await fetch(url, {
    headers: { "User-Agent": "cartografiasocial/1.0 (https://github.com/hericmr/cartografiasocial)" },
  });
  // Wikimedia limita downloads seguidos: espera e tenta de novo
  if (res.status === 429 && tentativa <= 4) {
    await new Promise((r) => setTimeout(r, 5000 * tentativa));
    return baixar(url, tentativa + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Converte uma entrada da coluna "imagens" em "media/arquivo.webp"
async function processarImagem(entrada, ponto) {
  if (entrada.startsWith("media/")) {
    if (!fs.existsSync(path.join(PUBLIC, entrada))) erros.push(`#${ponto.id} ${ponto.titulo}: arquivo não existe: ${entrada}`);
    return entrada;
  }
  if (CHECK) {
    erros.push(`#${ponto.id} ${ponto.titulo}: foto ainda não processada (${entrada}); rode npm run conteudo`);
    return null;
  }

  let origem;
  try {
    if (/^https?:\/\//.test(entrada)) {
      origem = await baixar(entrada);
    } else {
      const arquivo = path.join(FOTOS, entrada.replace(/^fotos\//, ""));
      if (!fs.existsSync(arquivo)) throw new Error("arquivo não encontrado em conteudo/fotos/");
      origem = fs.readFileSync(arquivo);
    }
  } catch (e) {
    erros.push(`#${ponto.id} ${ponto.titulo}: não consegui ler a foto ${entrada} (${e.message})`);
    return entrada;
  }

  const hash = crypto.createHash("sha1").update(origem).digest("hex").slice(0, 6);
  const nome = `media/${slugArquivo(ponto.titulo)}-${hash}.webp`;
  try {
    await sharp(origem)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(PUBLIC, nome));
  } catch (e) {
    erros.push(`#${ponto.id} ${ponto.titulo}: ${entrada} não é uma imagem válida (${e.message.split("\n")[0]})`);
    return entrada;
  }
  console.log(`  foto: ${entrada} -> ${nome}`);
  return nome;
}

function parseLinks(celula) {
  return lista(celula).map((item) => {
    const [a, b] = item.split("|").map((s) => s.trim());
    if (!b && !/^https?:\/\//.test(a)) return { texto: a, url: "" };
    const url = b || a;
    const texto = b ? a : new URL(url).hostname.replace(/^www\./, "");
    return { texto, url };
  });
}

const csvTexto = fs.readFileSync(CSV, "utf8");
const linhas = parse(csvTexto, { columns: true, bom: true, skip_empty_lines: true, trim: true });

const faltando = COLUNAS.filter((c) => !OPCIONAIS.includes(c) && !(c in (linhas[0] || {})));
if (faltando.length) {
  console.error(`Colunas faltando em pontos.csv: ${faltando.join(", ")}`);
  process.exit(1);
}

let proximoId = Math.max(0, ...linhas.map((l) => Number(l.id) || 0)) + 1;
const ids = new Set();
const pontos = [];

for (const linha of linhas) {
  if (!linha.titulo) continue;
  if (!linha.id) {
    if (CHECK) erros.push(`${linha.titulo}: sem id; rode npm run conteudo`);
    else linha.id = String(proximoId++);
  }
  if (ids.has(linha.id)) erros.push(`id repetido: ${linha.id}`);
  ids.add(linha.id);

  const lat = Number(String(linha.latitude).replace(",", "."));
  const lng = Number(String(linha.longitude).replace(",", "."));
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat > -23.5 || lat < -24.3 || lng > -46 || lng < -46.7) {
    erros.push(`#${linha.id} ${linha.titulo}: coordenadas fora de Santos (${linha.latitude}, ${linha.longitude})`);
  }
  if (!TIPOS[normalizar(linha.tipo)]) {
    avisos.push(`#${linha.id} ${linha.titulo}: tipo "${linha.tipo}" desconhecido, vai aparecer como Lazer e cultura`);
  }

  const imagens = [];
  for (const entrada of lista(linha.imagens)) {
    const resultado = await processarImagem(entrada, linha);
    if (resultado) imagens.push(resultado);
  }
  linha.imagens = imagens.join(" ; ");

  let links = [];
  let creditos = [];
  try {
    links = parseLinks(linha.links);
    creditos = parseLinks(linha.creditos);
  } catch {
    erros.push(`#${linha.id} ${linha.titulo}: link inválido em "${linha.links}" ou "${linha.creditos}"`);
  }

  if (linha.audio && !fs.existsSync(path.join(PUBLIC, linha.audio))) {
    erros.push(`#${linha.id} ${linha.titulo}: áudio não existe em public/: ${linha.audio}`);
  }

  pontos.push({
    id: Number(linha.id),
    titulo: linha.titulo,
    tipo: linha.tipo,
    descricao_detalhada: linha.descricao || "",
    imagens: imagens.filter((i) => i.startsWith("media/")).map((i) => `${BASE}/${i}`),
    audioUrl: linha.audio ? `${BASE}/${linha.audio}` : "",
    video: linha.video || "",
    links,
    creditos,
    latitude: lat,
    longitude: lng,
  });
}

const json = JSON.stringify(pontos);

if (CHECK) {
  const atual = fs.existsSync(JSON_OUT) ? fs.readFileSync(JSON_OUT, "utf8") : "";
  if (atual !== json) erros.push("public/data/locations.json está desatualizado; rode npm run conteudo e faça commit");
} else {
  fs.writeFileSync(JSON_OUT, json);
  fs.writeFileSync(CSV, stringify(linhas, { header: true, columns: COLUNAS, bom: true }));

  const pendentes = pontos
    .map((p) => {
      const desc = textoPuro(p.descricao_detalhada).length;
      return {
        titulo: p.titulo,
        categoria: TIPOS[normalizar(p.tipo)] || "Lazer e cultura",
        foto: p.imagens.length ? "sim" : "NÃO",
        descricao: desc === 0 ? "vazia" : desc < DESCRICAO_MINIMA ? "curta" : "ok",
        caracteres: desc,
        link: `${SITE}/?panel=${slugPainel(p.titulo)}`,
      };
    })
    .filter((p) => p.foto === "NÃO" || p.descricao !== "ok")
    .sort((a, b) => a.categoria.localeCompare(b.categoria) || a.foto.localeCompare(b.foto) || a.caracteres - b.caracteres);
  fs.writeFileSync(PENDENTES, stringify(pendentes, { header: true, bom: true }));

  const semFoto = pendentes.filter((p) => p.foto === "NÃO").length;
  const descFraca = pendentes.filter((p) => p.descricao !== "ok").length;
  console.log(`\n${pontos.length} pontos | ${pontos.length - pendentes.length} completos | ${semFoto} sem foto | ${descFraca} com descrição vazia ou curta`);
  console.log("Lista em conteudo/pendentes.csv");
}

for (const a of avisos) console.warn(`aviso: ${a}`);
if (erros.length) {
  for (const e of erros) console.error(`erro: ${e}`);
  process.exit(1);
}
