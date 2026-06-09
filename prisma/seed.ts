import { PrismaClient } from "@prisma/client";
import { serializeImages } from "../src/lib/utils";

const prisma = new PrismaClient();

// Clean interior / furniture photography pool (support imagery only).
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

const POOL = {
  kitchen1: img("1556911220-bff31c812dba"),
  kitchen2: img("1600489000022-c2086d79f9d4"),
  kitchen3: img("1565538810643-b5bdb714032a"),
  interior1: img("1600585154340-be6161a56a0c"),
  interior2: img("1600121848594-d8644e57abab"),
  interior3: img("1616486338812-3dadae4b4ace"),
  living1: img("1524758631624-e2822e304c36"),
  living2: img("1567016432779-094069958ea5"),
  shelf1: img("1594026112284-02bb6f3352fe"),
  shelf2: img("1604578762246-41134e37f9cc"),
  bedroom1: img("1505693416388-ac5ce068fe85"),
  bedroom2: img("1540518614846-7eded433c457"),
  cabinet1: img("1583847268964-b28dc8f51f92"),
  detail1: img("1503602642458-232111445657"),
  detail2: img("1538688525198-9b88f6f53126"),
  wood1: img("1610701596007-11502861dcfa"),
};

async function main() {
  console.log("→ Seeding Pedro Cunha Carpintaria…");

  // ── Wipe (idempotent reseed) ────────────────────────────────
  await prisma.catalogItem.deleteMany();
  await prisma.project.deleteMany();
  await prisma.category.deleteMany();

  // ── Categories ──────────────────────────────────────────────
  const categoriesData = [
    { slug: "bespoke", namePt: "Mobiliário à Medida", nameEn: "Made-to-measure", nameFr: "Sur mesure", scope: "catalog", order: 1 },
    { slug: "kitchens", namePt: "Cozinhas", nameEn: "Kitchens", nameFr: "Cuisines", scope: "catalog", order: 2 },
    { slug: "wardrobes", namePt: "Roupeiros", nameEn: "Wardrobes", nameFr: "Dressings", scope: "catalog", order: 3 },
    { slug: "interiors", namePt: "Interiores", nameEn: "Interiors", nameFr: "Intérieurs", scope: "both", order: 4 },
    { slug: "others", namePt: "Outros", nameEn: "Others", nameFr: "Autres", scope: "catalog", order: 5 },
    { slug: "residential", namePt: "Residencial", nameEn: "Residential", nameFr: "Résidentiel", scope: "project", order: 6 },
    { slug: "commercial", namePt: "Comercial", nameEn: "Commercial", nameFr: "Commercial", scope: "project", order: 7 },
    { slug: "renovation", namePt: "Reabilitação", nameEn: "Renovation", nameFr: "Rénovation", scope: "project", order: 8 },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoriesData) {
    const created = await prisma.category.create({ data: c });
    categories[c.slug] = created.id;
  }

  // ── Catalog items ───────────────────────────────────────────
  const catalog = [
    {
      slug: "cozinha-linha",
      categoryId: categories.kitchens,
      titlePt: "Cozinha Linha", titleEn: "Linha Kitchen", titleFr: "Cuisine Linha",
      descriptionPt: "Cozinha sem puxadores, com continuidade de veio em carvalho fumado e bancada monolítica. A geometria reduz-se ao essencial: planos limpos, sombras precisas e abertura por toque.",
      descriptionEn: "A handleless kitchen with continuous smoked-oak grain and a monolithic worktop. Geometry reduced to the essential: clean planes, precise shadows and push-to-open fronts.",
      descriptionFr: "Une cuisine sans poignées, au veinage continu en chêne fumé et plan de travail monolithique. La géométrie se réduit à l'essentiel : plans nets, ombres précises et ouverture par pression.",
      materialsPt: "Carvalho fumado, pedra Silestone, lacado mate",
      materialsEn: "Smoked oak, Silestone, matte lacquer",
      materialsFr: "Chêne fumé, Silestone, laque mate",
      dimensions: "420 × 90 × 240 cm",
      images: [POOL.kitchen1, POOL.kitchen2, POOL.detail2],
      featured: true, order: 1,
    },
    {
      slug: "roupeiro-marco",
      categoryId: categories.wardrobes,
      titlePt: "Roupeiro Marco", titleEn: "Marco Wardrobe", titleFr: "Dressing Marco",
      descriptionPt: "Roupeiro de chão a teto, com portas em ripado vertical e interior compartimentado à medida. O pórtico que enquadra as portas cita diretamente a moldura do monograma.",
      descriptionEn: "A floor-to-ceiling wardrobe with vertical-slatted doors and a fully bespoke interior. The portal framing the doors quotes the monogram's frame directly.",
      descriptionFr: "Un dressing du sol au plafond, aux portes à lattes verticales et à l'intérieur entièrement sur mesure. Le portique encadrant les portes cite directement le cadre du monogramme.",
      materialsPt: "Freixo, lacado areia, ferragens ocultas",
      materialsEn: "Ash, sand lacquer, concealed hardware",
      materialsFr: "Frêne, laque sable, quincaillerie cachée",
      dimensions: "300 × 60 × 260 cm",
      images: [POOL.bedroom1, POOL.cabinet1, POOL.detail1],
      featured: true, order: 2,
    },
    {
      slug: "estante-portico",
      categoryId: categories.bespoke,
      titlePt: "Estante Pórtico", titleEn: "Pórtico Shelving", titleFr: "Étagère Pórtico",
      descriptionPt: "Sistema de estante modular construído a partir de pórticos repetidos. Estrutura à vista, prateleiras suspensas e ritmo constante — uma grelha habitável.",
      descriptionEn: "A modular shelving system built from repeated portals. Exposed structure, floating shelves and a constant rhythm — an inhabitable grid.",
      descriptionFr: "Un système d'étagères modulaire construit à partir de portiques répétés. Structure apparente, tablettes suspendues et rythme constant — une grille habitable.",
      materialsPt: "Carvalho maciço, óleo natural",
      materialsEn: "Solid oak, natural oil",
      materialsFr: "Chêne massif, huile naturelle",
      dimensions: "240 × 32 × 220 cm",
      images: [POOL.shelf1, POOL.shelf2, POOL.interior3],
      featured: true, order: 3,
    },
    {
      slug: "ilha-bloco",
      categoryId: categories.kitchens,
      titlePt: "Ilha Bloco", titleEn: "Bloco Island", titleFr: "Îlot Bloco",
      descriptionPt: "Ilha de cozinha lida como um único volume. Topo e laterais no mesmo material, juntas mínimas e um rasgo contínuo que arruma a iluminação.",
      descriptionEn: "A kitchen island read as a single volume. Top and sides in the same material, minimal joints and a continuous reveal that hides the lighting.",
      descriptionFr: "Un îlot de cuisine lu comme un seul volume. Plateau et côtés dans le même matériau, joints minimaux et une rainure continue qui dissimule l'éclairage.",
      materialsPt: "Nogueira, aço inox escovado",
      materialsEn: "Walnut, brushed stainless steel",
      materialsFr: "Noyer, acier inoxydable brossé",
      dimensions: "260 × 110 × 92 cm",
      images: [POOL.kitchen3, POOL.kitchen1, POOL.wood1],
      featured: false, order: 4,
    },
    {
      slug: "aparador-carena",
      categoryId: categories.bespoke,
      titlePt: "Aparador Carena", titleEn: "Carena Sideboard", titleFr: "Buffet Carena",
      descriptionPt: "Aparador suspenso com frente em folheado contínuo. As portas dividem-se por uma única linha horizontal, como o traço que separa as palavras no logótipo.",
      descriptionEn: "A wall-hung sideboard with a continuous veneered front. The doors are split by a single horizontal line, like the rule between the words in the logo.",
      descriptionFr: "Un buffet suspendu à façade en placage continu. Les portes sont divisées par une seule ligne horizontale, comme le filet entre les mots du logo.",
      materialsPt: "Folheado de nogueira, base lacada",
      materialsEn: "Walnut veneer, lacquered base",
      materialsFr: "Placage de noyer, base laquée",
      dimensions: "180 × 45 × 52 cm",
      images: [POOL.cabinet1, POOL.living1, POOL.detail2],
      featured: false, order: 5,
    },
    {
      slug: "painel-ripado",
      categoryId: categories.interiors,
      titlePt: "Painel Ripado", titleEn: "Slatted Panel", titleFr: "Panneau à Lattes",
      descriptionPt: "Revestimento de parede em ripado de madeira que ordena o espaço e absorve o som. O ritmo das ripas é calibrado ao milímetro para um padrão sem fim aparente.",
      descriptionEn: "A slatted timber wall lining that orders the space and absorbs sound. The rhythm of the slats is calibrated to the millimetre for a seamless pattern.",
      descriptionFr: "Un revêtement mural à lattes de bois qui ordonne l'espace et absorbe le son. Le rythme des lattes est calibré au millimètre pour un motif sans fin apparente.",
      materialsPt: "Ripas de carvalho, feltro acústico",
      materialsEn: "Oak slats, acoustic felt",
      materialsFr: "Lattes de chêne, feutre acoustique",
      dimensions: "Sob medida",
      images: [POOL.interior1, POOL.interior2, POOL.living2],
      featured: false, order: 6,
    },
    {
      slug: "closet-atrium",
      categoryId: categories.wardrobes,
      titlePt: "Closet Atrium", titleEn: "Atrium Walk-in", titleFr: "Dressing Atrium",
      descriptionPt: "Walk-in closet com ilha central, gavetas em veludo e iluminação integrada. Tudo desenhado à volta de uma grelha modular silenciosa.",
      descriptionEn: "A walk-in closet with a central island, velvet-lined drawers and integrated lighting. Everything designed around a quiet modular grid.",
      descriptionFr: "Un dressing avec îlot central, tiroirs garnis de velours et éclairage intégré. Tout est dessiné autour d'une grille modulaire silencieuse.",
      materialsPt: "Freixo claro, vidro fumado, latão",
      materialsEn: "Pale ash, smoked glass, brass",
      materialsFr: "Frêne clair, verre fumé, laiton",
      dimensions: "Sob medida",
      images: [POOL.bedroom2, POOL.cabinet1, POOL.detail1],
      featured: false, order: 7,
    },
    {
      slug: "biblioteca-codex",
      categoryId: categories.interiors,
      titlePt: "Biblioteca Codex", titleEn: "Codex Library", titleFr: "Bibliothèque Codex",
      descriptionPt: "Biblioteca de parede inteira com escada corrediça e escritório embutido. A composição assimétrica equilibra cheios e vazios numa única leitura.",
      descriptionEn: "A full-wall library with a sliding ladder and a built-in desk. The asymmetric composition balances solids and voids in a single reading.",
      descriptionFr: "Une bibliothèque pleine hauteur avec échelle coulissante et bureau intégré. La composition asymétrique équilibre pleins et vides en une seule lecture.",
      materialsPt: "Carvalho fumado, aço pintado",
      materialsEn: "Smoked oak, painted steel",
      materialsFr: "Chêne fumé, acier peint",
      dimensions: "480 × 38 × 300 cm",
      images: [POOL.shelf2, POOL.shelf1, POOL.interior3],
      featured: false, order: 8,
    },
  ];

  for (const item of catalog) {
    const { images, ...rest } = item;
    await prisma.catalogItem.create({
      data: { ...rest, images: serializeImages(images), published: true },
    });
  }

  // ── Projects ────────────────────────────────────────────────
  const projects = [
    {
      slug: "casa-douro",
      categoryId: categories.residential,
      titlePt: "Casa Douro", titleEn: "Douro House", titleFr: "Maison Douro",
      descriptionPt: "Carpintaria integral de uma casa sobre o rio: cozinha, roupeiros, painéis e mobiliário de sala desenhados como um sistema único. A madeira percorre a casa como fio condutor, unificando divisões com diferentes funções.",
      descriptionEn: "Full joinery for a house above the river: kitchen, wardrobes, panelling and living-room furniture designed as one system. Timber runs through the house as a thread, unifying rooms of different function.",
      descriptionFr: "Menuiserie intégrale d'une maison surplombant le fleuve : cuisine, dressings, lambris et mobilier de séjour conçus comme un seul système. Le bois traverse la maison comme un fil conducteur.",
      location: "Peso da Régua", year: 2024,
      images: [POOL.interior1, POOL.living1, POOL.kitchen2, POOL.bedroom1],
      featured: true, order: 1,
    },
    {
      slug: "apartamento-foz",
      categoryId: categories.renovation,
      titlePt: "Apartamento Foz", titleEn: "Foz Apartment", titleFr: "Appartement Foz",
      descriptionPt: "Reabilitação de um apartamento dos anos 70 junto ao mar. Removemos paredes e devolvemos ordem com um sistema de armários que arruma, separa e ilumina, sem nunca pesar.",
      descriptionEn: "Renovation of a 1970s seafront apartment. We removed walls and restored order with a cabinetry system that stores, divides and lights, without ever weighing down.",
      descriptionFr: "Rénovation d'un appartement des années 70 en bord de mer. Nous avons supprimé des murs et rétabli l'ordre avec un système d'armoires qui range, sépare et éclaire, sans jamais alourdir.",
      location: "Porto", year: 2023,
      images: [POOL.living2, POOL.interior2, POOL.cabinet1],
      featured: true, order: 2,
    },
    {
      slug: "atelier-baixa",
      categoryId: categories.commercial,
      titlePt: "Atelier Baixa", titleEn: "Baixa Atelier", titleFr: "Atelier Baixa",
      descriptionPt: "Espaço de trabalho para um estúdio de design. Bancadas longas, arrumação contínua e um balcão de receção esculpido num só volume de carvalho.",
      descriptionEn: "A workspace for a design studio. Long benches, continuous storage and a reception desk carved from a single oak volume.",
      descriptionFr: "Un espace de travail pour un studio de design. Longues tables, rangements continus et un comptoir d'accueil sculpté dans un seul volume de chêne.",
      location: "Lisboa", year: 2024,
      images: [POOL.interior3, POOL.shelf1, POOL.living1],
      featured: true, order: 3,
    },
    {
      slug: "quinta-tamega",
      categoryId: categories.residential,
      titlePt: "Quinta Tâmega", titleEn: "Tâmega Estate", titleFr: "Domaine Tâmega",
      descriptionPt: "Mobiliário e carpintaria para uma quinta reconvertida. O desafio foi unir a robustez do edifício rural com um interior contemporâneo, sereno e preciso.",
      descriptionEn: "Furniture and joinery for a converted estate. The challenge was to marry the robustness of the rural building with a contemporary, serene and precise interior.",
      descriptionFr: "Mobilier et menuiserie pour un domaine reconverti. Le défi était d'unir la robustesse du bâtiment rural à un intérieur contemporain, serein et précis.",
      location: "Amarante", year: 2022,
      images: [POOL.interior2, POOL.kitchen3, POOL.bedroom2],
      featured: false, order: 4,
    },
    {
      slug: "loja-norma",
      categoryId: categories.commercial,
      titlePt: "Loja Norma", titleEn: "Norma Store", titleFr: "Boutique Norma",
      descriptionPt: "Conceito de retalho para uma marca de moda. Expositores modulares em freixo claro que se reconfiguram a cada coleção, mantendo uma grelha constante.",
      descriptionEn: "A retail concept for a fashion brand. Modular pale-ash displays that reconfigure with every collection while keeping a constant grid.",
      descriptionFr: "Un concept de vente pour une marque de mode. Présentoirs modulaires en frêne clair qui se reconfigurent à chaque collection, tout en gardant une grille constante.",
      location: "Braga", year: 2023,
      images: [POOL.shelf2, POOL.interior1, POOL.detail1],
      featured: false, order: 5,
    },
    {
      slug: "duplex-boavista",
      categoryId: categories.renovation,
      titlePt: "Duplex Boavista", titleEn: "Boavista Duplex", titleFr: "Duplex Boavista",
      descriptionPt: "Escada e biblioteca como peça central de um duplex. Um único gesto de carpintaria liga os dois pisos e organiza toda a vida da casa em redor.",
      descriptionEn: "A staircase and library as the centrepiece of a duplex. A single act of joinery links the two floors and organises the whole life of the house around it.",
      descriptionFr: "Un escalier et une bibliothèque comme pièce maîtresse d'un duplex. Un seul geste de menuiserie relie les deux étages et organise toute la vie de la maison.",
      location: "Porto", year: 2025,
      images: [POOL.shelf1, POOL.interior3, POOL.living2],
      featured: false, order: 6,
    },
  ];

  for (const p of projects) {
    const { images, ...rest } = p;
    await prisma.project.create({
      data: { ...rest, images: serializeImages(images), published: true },
    });
  }

  const [cats, items, projs] = await Promise.all([
    prisma.category.count(),
    prisma.catalogItem.count(),
    prisma.project.count(),
  ]);
  console.log(`✓ Seeded ${cats} categories, ${items} catalog items, ${projs} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
