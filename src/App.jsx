import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS — Madame Baunilha ─────────────────────────────────────────
const theme = {
  cream: "#FAF8F4",
  offwhite: "#F3EFE8",
  beige: "#E6DDD0",
  warm: "#C9BBA8",
  // Terracotta/laranja do logo
  terracotta: "#D4622A",
  terracottaLight: "#E07A48",
  terracottaDark: "#B04F20",
  // Teal/verde do logo
  sage: "#2A7B78",
  sageDark: "#1E5C5A",
  sageLight: "#3A9E9A",
  // Neutros
  brown: "#4A3728",
  brownLight: "#6B5244",
  charcoal: "#251A14",
  muted: "#8A7468",
  white: "#FFFFFF",
};

// ─── GOOGLE FONTS (injected) ──────────────────────────────────────────────────
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: ${theme.cream};
    color: ${theme.charcoal};
    line-height: 1.6;
    overflow-x: hidden;
  }

  h1,h2,h3,h4 {
    font-family: 'Cormorant Garamond', serif;
    line-height: 1.2;
  }

  img { max-width: 100%; height: auto; display: block; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${theme.offwhite}; }
  ::-webkit-scrollbar-thumb { background: ${theme.warm}; border-radius: 3px; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideRight {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }

  .fade-up { animation: fadeUp 0.7s ease forwards; }
  .fade-in { animation: fadeIn 0.5s ease forwards; }

  /* Responsive grid helpers */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

  @media (max-width: 1024px) {
    .grid-4 { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
  }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const recipes = [
  {
    id: 1,
    title: "Risoto de Funghi com Parmesão",
    category: "Massas & Risotos",
    time: "40 min",
    difficulty: "Médio",
    servings: "4 porções",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    description: "Um risoto cremoso e aromático com funghi secchi reidratados e parmesão italiano de qualidade.",
    tags: ["Risoto", "Vegetariano", "Italiano"],
    featured: true,
    ingredients: [
      "300g arroz arbóreo",
      "50g funghi secchi",
      "1 cebola média picada",
      "2 dentes de alho",
      "150ml vinho branco seco",
      "1L caldo de legumes quente",
      "80g parmesão ralado",
      "3 colheres de manteiga",
      "Sal e pimenta a gosto",
      "Salsinha fresca",
    ],
    steps: [
      "Reidrate o funghi em água morna por 20 minutos. Reserve a água coada.",
      "Refogue cebola e alho na manteiga até ficarem translúcidos.",
      "Adicione o arroz e toste por 2 minutos em fogo médio-alto.",
      "Deglace com o vinho branco e mexa até evaporar.",
      "Adicione o caldo aos poucos, colher a colher, sempre mexendo.",
      "Acrescente o funghi e a água do funghi coada na metade do cozimento.",
      "Finalize com manteiga, parmesão, ajuste sal e sirva imediatamente.",
    ],
    tip: "O segredo do risoto perfeito é não parar de mexer e usar caldo sempre quente.",
    relatedProducts: [1, 3],
    relatedRecipes: [2, 5],
  },
  {
    id: 2,
    title: "Bolo de Limão Siciliano com Calda",
    category: "Doces & Bolos",
    time: "55 min",
    difficulty: "Fácil",
    servings: "8 fatias",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    description: "Bolo úmido e perfumado com raspas de limão siciliano, finalizado com calda cítrica irresistível.",
    tags: ["Bolo", "Cítrico", "Café da manhã"],
    featured: true,
    ingredients: [
      "3 ovos",
      "200g açúcar",
      "150ml azeite de oliva",
      "Raspas e suco de 2 limões sicilianos",
      "200g farinha de trigo",
      "1 colher de fermento",
      "1 pitada de sal",
    ],
    steps: [
      "Bata os ovos com o açúcar até ficar claro e aerado.",
      "Adicione o azeite, raspas e suco de limão, misture.",
      "Incorpore a farinha, fermento e sal delicadamente.",
      "Asse em forma untada a 180°C por 35-40 minutos.",
      "Prepare a calda com suco de limão e açúcar de confeiteiro e regue o bolo ainda quente.",
    ],
    tip: "Use azeite de oliva extra virgem para um sabor mais sofisticado.",
    relatedProducts: [2, 4],
    relatedRecipes: [3, 6],
  },
  {
    id: 3,
    title: "Salmão Grelhado com Manteiga de Ervas",
    category: "Pratos Principais",
    time: "25 min",
    difficulty: "Fácil",
    servings: "2 porções",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    description: "Salmão suculento grelhado com manteiga composta de ervas finas e limão.",
    tags: ["Peixe", "Proteína", "Saudável"],
    featured: true,
    ingredients: [
      "2 filés de salmão",
      "3 colheres de manteiga",
      "Alecrim e tomilho frescos",
      "1 limão",
      "Alho picado",
      "Sal grosso e pimenta",
    ],
    steps: [
      "Tempere o salmão com sal, pimenta e alho.",
      "Grelhe em frigideira quente com azeite por 4 minutos de cada lado.",
      "Prepare a manteiga de ervas misturando manteiga amolecida com ervas e raspas de limão.",
      "Sirva o salmão com uma colher generosa da manteiga de ervas.",
    ],
    tip: "Não mova o salmão enquanto grelha — a crosta dourada é o segredo.",
    relatedProducts: [1, 5],
    relatedRecipes: [1, 4],
  },
  {
    id: 4,
    title: "Pão de Fermentação Natural",
    category: "Pães & Massas",
    time: "18h",
    difficulty: "Avançado",
    servings: "1 pão",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&q=80",
    description: "Pão artesanal de fermentação lenta com casca crocante e miolo cheio de sabor.",
    tags: ["Pão", "Artesanal", "Fermentação Natural"],
    featured: false,
    ingredients: [
      "500g farinha tipo 1",
      "150g levain ativo",
      "350ml água filtrada",
      "10g sal marinho",
    ],
    steps: [
      "Misture farinha e água, deixe autolisando por 1h.",
      "Adicione o levain e o sal, incorpore bem.",
      "Realize dobras a cada 30 min por 4h (bulk fermentation).",
      "Modele e leve à geladeira por 12h.",
      "Asse em dutch oven a 250°C por 20 min tampado e 25 min destampado.",
    ],
    tip: "A temperatura da cozinha influencia muito o tempo de fermentação.",
    relatedProducts: [2, 6],
    relatedRecipes: [5, 6],
  },
  {
    id: 5,
    title: "Tagliatelle ao Ragù Bolognese",
    category: "Massas & Risotos",
    time: "3h",
    difficulty: "Médio",
    servings: "6 porções",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    description: "O clássico ragù à bolognese preparado lentamente, rico, encorpado e cheio de sabor.",
    tags: ["Massa", "Carne", "Italiano"],
    featured: false,
    ingredients: [
      "400g tagliatelle fresco",
      "300g carne moída bovina",
      "150g linguiça italiana",
      "200ml vinho tinto",
      "400g tomate pelado",
      "Cenoura, salsão, cebola",
      "Leite integral",
    ],
    steps: [
      "Refogue o soffritto (cenoura, salsão, cebola) em manteiga.",
      "Doure as carnes e deglace com vinho tinto.",
      "Adicione o tomate, tampe e cozinhe em fogo baixo por 2h.",
      "Finalize com um fio de leite para suavizar a acidez.",
      "Sirva sobre tagliatelle al dente.",
    ],
    tip: "Quanto mais tempo no fogo baixo, melhor o sabor.",
    relatedProducts: [1, 3],
    relatedRecipes: [1, 3],
  },
  {
    id: 6,
    title: "Cheesecake de Maracujá",
    category: "Doces & Bolos",
    time: "4h",
    difficulty: "Médio",
    servings: "10 fatias",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    description: "Cheesecake cremoso com base de biscoito amanteigado e calda fresca de maracujá.",
    tags: ["Sobremesa", "Frutas", "Sem Forno"],
    featured: false,
    ingredients: [
      "200g cream cheese",
      "200ml creme de leite",
      "1 lata de leite condensado",
      "Suco de 3 maracujás",
      "200g biscoito maisena",
      "80g manteiga derretida",
      "1 envelope de gelatina sem sabor",
    ],
    steps: [
      "Processe o biscoito com manteiga e forre a forma.",
      "Dissolva a gelatina e misture com cream cheese, leite condensado e creme.",
      "Despeje sobre a base e leve à geladeira por 4h.",
      "Prepare a calda com maracujá e açúcar e cubra antes de servir.",
    ],
    tip: "Use maracujá fresco para uma calda mais intensa e natural.",
    relatedProducts: [4, 6],
    relatedRecipes: [2, 4],
  },
];

const products = [
  {
    id: 1,
    name: "Azeite Extra Virgem Arbequina",
    category: "Óleos & Azeites",
    price: 89.9,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
    description: "Azeite de oliva extra virgem de primeira prensagem a frio, com sabor frutado suave e aroma delicado.",
    benefits: ["Prensagem a frio", "Acidez < 0,5%", "Origem controlada", "Embalagem premium"],
    relatedRecipes: [1, 3, 5],
    featured: true,
  },
  {
    id: 2,
    name: "Mix de Especiarias Mediterrâneas",
    category: "Temperos",
    price: 34.9,
    image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&q=80",
    description: "Blend exclusivo com ervas mediterrâneas secas: manjericão, orégano, tomilho e alecrim.",
    benefits: ["Blend exclusivo", "100% natural", "Sem conservantes", "Aroma intenso"],
    relatedRecipes: [3, 5, 1],
    featured: true,
  },
  {
    id: 3,
    name: "Flor de Sal com Ervas",
    category: "Sais Especiais",
    price: 42.0,
    image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&q=80",
    description: "Flor de sal colhida artesanalmente, misturada com ervas finas para finalização de pratos.",
    benefits: ["Colheita artesanal", "Baixo teor de sódio", "Textura delicada", "Sabor mineral"],
    relatedRecipes: [3, 4, 1],
    featured: false,
  },
  {
    id: 4,
    name: "Extrato de Baunilha Bourbon",
    category: "Extratos & Essências",
    price: 56.9,
    image: "https://images.unsplash.com/photo-1611048661702-7b55eed346b4?w=800&q=80",
    description: "Extrato puro de baunilha bourbon madagascarense, ideal para doces e confeitaria.",
    benefits: ["Fava natural", "Intensidade real", "Sem álcool", "Rende muito"],
    relatedRecipes: [2, 6],
    featured: true,
  },
  {
    id: 5,
    name: "Manteiga Clarificada (Ghee)",
    category: "Laticínios",
    price: 48.5,
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    description: "Ghee puro de manteiga de vacas criadas a pasto, com ponto de fumaça elevado e sabor amendoado.",
    benefits: ["Sem caseína", "Ponto de fumaça alto", "Sabor rico", "Lactose reduzida"],
    relatedRecipes: [1, 3, 5],
    featured: false,
  },
  {
    id: 6,
    name: "Açúcar de Coco Orgânico",
    category: "Açúcares",
    price: 28.9,
    image: "https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=800&q=80",
    description: "Açúcar de coco orgânico com índice glicêmico baixo e sabor levemente caramelado.",
    benefits: ["Orgânico", "Baixo IG", "Trace minerals", "Versátil"],
    relatedRecipes: [2, 6, 4],
    featured: false,
  },
];

const categories = [
  { id: 1, name: "Massas & Risotos", icon: "🍝", count: 24 },
  { id: 2, name: "Doces & Bolos", icon: "🎂", count: 18 },
  { id: 3, name: "Pratos Principais", icon: "🍽️", count: 32 },
  { id: 4, name: "Pães & Massas", icon: "🍞", count: 15 },
  { id: 5, name: "Saladas & Vegetariano", icon: "🥗", count: 21 },
  { id: 6, name: "Bebidas & Drinques", icon: "🍹", count: 9 },
];

const testimonials = [
  {
    id: 1,
    name: "Mariana Costa",
    text: "As receitas são incríveis e os produtos têm uma qualidade absurda. O azeite arbequina transformou minhas preparações!",
    rating: 5,
    avatar: "MC",
  },
  {
    id: 2,
    name: "Fernanda Lima",
    text: "Finalmente encontrei um espaço que combina receitas reais com produtos que de fato usamos no dia a dia. Recomendo muito!",
    rating: 5,
    avatar: "FL",
  },
  {
    id: 3,
    name: "Beatriz Mendes",
    text: "O bolo de limão virou o favorito da família. A calda com extrato de baunilha é um diferencial incrível.",
    rating: 5,
    avatar: "BM",
  },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  // Layout
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  section: {
    padding: "80px 0",
  },
  sectionAlt: {
    padding: "80px 0",
    background: theme.offwhite,
  },

  // Typography
  sectionLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: theme.terracotta,
    marginBottom: "12px",
    display: "block",
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(28px, 4vw, 46px)",
    fontWeight: 700,
    color: theme.charcoal,
    marginBottom: "16px",
  },
  sectionSubtitle: {
    fontSize: "16px",
    color: theme.muted,
    fontWeight: 300,
    maxWidth: "500px",
  },

  // Buttons
  btnPrimary: {
    background: theme.terracotta,
    color: theme.white,
    padding: "14px 32px",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    cursor: "pointer",
  },
  btnOutline: {
    background: "transparent",
    color: theme.terracotta,
    padding: "12px 28px",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: 600,
    border: `2px solid ${theme.terracotta}`,
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  btnWhite: {
    background: theme.white,
    color: theme.terracotta,
    padding: "14px 32px",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: 600,
    transition: "all 0.3s ease",
    border: "none",
    cursor: "pointer",
  },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

// SectionHeader
const SectionHeader = ({ label, title, subtitle, centered = false }) => (
  <div style={{ textAlign: centered ? "center" : "left", marginBottom: "48px" }}>
    <span style={S.sectionLabel}>{label}</span>
    <h2 style={{ ...S.sectionTitle, ...(centered && { margin: "0 auto 16px" }) }}>{title}</h2>
    {subtitle && (
      <p style={{ ...S.sectionSubtitle, ...(centered && { margin: "0 auto" }) }}>{subtitle}</p>
    )}
  </div>
);

// RecipeCard
const RecipeCard = ({ recipe, onClick, featured = false }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(recipe)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: theme.white,
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 50px rgba(44,36,33,0.15)"
          : "0 2px 20px rgba(44,36,33,0.06)",
        gridColumn: featured ? "span 1" : "span 1",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden", height: featured ? 260 : 220 }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />
        <div style={{
          position: "absolute", top: "16px", left: "16px",
          background: "rgba(250,247,242,0.92)",
          backdropFilter: "blur(8px)",
          borderRadius: "30px",
          padding: "4px 14px",
          fontSize: "11px",
          fontWeight: 600,
          color: theme.terracotta,
          letterSpacing: "0.5px",
        }}>
          {recipe.category}
        </div>
        <div style={{
          position: "absolute", bottom: "16px", right: "16px",
          background: "rgba(250,247,242,0.92)",
          backdropFilter: "blur(8px)",
          borderRadius: "30px",
          padding: "4px 14px",
          fontSize: "12px",
          color: theme.muted,
        }}>
          ⏱ {recipe.time}
        </div>
      </div>
      <div style={{ padding: "24px" }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "19px",
          fontWeight: 600,
          marginBottom: "8px",
          color: theme.charcoal,
          lineHeight: 1.3,
        }}>{recipe.title}</h3>
        <p style={{ fontSize: "14px", color: theme.muted, lineHeight: 1.6, marginBottom: "16px" }}>
          {recipe.description.substring(0, 90)}...
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontSize: "12px", color: theme.sage, fontWeight: 600,
            background: `${theme.sage}18`, borderRadius: "20px", padding: "4px 12px"
          }}>
            {recipe.difficulty}
          </span>
          <span style={{
            color: hovered ? theme.terracotta : theme.muted,
            fontSize: "13px",
            fontWeight: 500,
            transition: "color 0.3s",
          }}>
            Ver receita →
          </span>
        </div>
      </div>
    </div>
  );
};

// ProductCard
const ProductCard = ({ product, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: theme.white,
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 50px rgba(44,36,33,0.15)"
          : "0 2px 20px rgba(44,36,33,0.06)",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden", height: 240 }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />
        <div style={{
          position: "absolute", top: "16px", left: "16px",
          background: "rgba(250,247,242,0.92)",
          backdropFilter: "blur(8px)",
          borderRadius: "30px",
          padding: "4px 14px",
          fontSize: "11px",
          fontWeight: 600,
          color: theme.muted,
          letterSpacing: "0.5px",
        }}>
          {product.category}
        </div>
      </div>
      <div style={{ padding: "24px" }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "17px",
          fontWeight: 600,
          marginBottom: "6px",
          color: theme.charcoal,
        }}>{product.name}</h3>
        <p style={{ fontSize: "13px", color: theme.muted, marginBottom: "16px", lineHeight: 1.5 }}>
          {product.description.substring(0, 70)}...
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "22px",
            fontWeight: 700,
            color: theme.terracotta,
          }}>
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          <button
            style={{
              background: hovered ? theme.terracotta : "transparent",
              color: hovered ? theme.white : theme.terracotta,
              border: `2px solid ${theme.terracotta}`,
              borderRadius: "30px",
              padding: "8px 18px",
              fontSize: "13px",
              fontWeight: 600,
              transition: "all 0.3s",
              cursor: "pointer",
            }}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

// CategoryCard
const CategoryCard = ({ cat, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick && onClick(cat.name)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? theme.sage : theme.white,
        borderRadius: "20px",
        padding: "28px 20px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered
          ? "0 16px 40px rgba(42,123,120,0.28)"
          : "0 2px 16px rgba(44,36,33,0.06)",
      }}
    >
      <div style={{ fontSize: "36px", marginBottom: "12px" }}>{cat.icon}</div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "15px",
        fontWeight: 600,
        color: hovered ? theme.white : theme.charcoal,
        marginBottom: "4px",
      }}>{cat.name}</div>
      <div style={{ fontSize: "12px", color: hovered ? "rgba(255,255,255,0.7)" : theme.muted }}>
        {cat.count} receitas
      </div>
    </div>
  );
};

// ─── HEADER ──────────────────────────────────────────────────────────────────
const Header = ({ page, setPage, cartCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Início", page: "home" },
    { label: "Receitas", page: "recipes" },
    { label: "Loja", page: "shop" },
    { label: "Sobre", page: "about" },
    { label: "Contato", page: "contact" },
  ];

  return (
    <>
      <style>{`
        .nav-link { position: relative; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 2px;
          background: ${theme.sage};
          transition: width 0.3s ease;
          transform-origin: left;
        }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .mobile-menu {
          position: fixed; top: 0; right: 0;
          width: 280px; height: 100vh;
          background: ${theme.white};
          z-index: 1000;
          padding: 80px 32px 32px;
          box-shadow: -20px 0 60px rgba(44,36,33,0.12);
          transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .mobile-overlay {
          position: fixed; inset: 0;
          background: rgba(44,36,33,0.4);
          z-index: 999;
          backdrop-filter: blur(4px);
        }
        .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(196,113,74,0.35); }
      `}</style>

      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(250,248,244,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${theme.beige}` : "none",
        transition: "all 0.4s ease",
        padding: "0 20px",
      }}>
        <div style={{
          ...S.container,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "76px",
        }}>
          {/* Logo */}
          <button
            onClick={() => setPage("home")}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <img
              src="/Madame_baunilha_AF_alta.png"
              alt="Madame Baunilha"
              onError={e => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
              style={{ height: "48px", width: "auto", objectFit: "contain" }}
            />
            <div style={{
              display: "none",
              alignItems: "center",
              gap: "10px",
            }}>
              <div style={{
                width: "38px", height: "38px",
                background: `linear-gradient(135deg, ${theme.sage}, ${theme.sageDark})`,
                borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
              }}>🌿</div>
              <div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: theme.charcoal,
                  lineHeight: 1,
                }}>Madame Baunilha</div>
                <div style={{ fontSize: "9px", letterSpacing: "2px", color: theme.muted, fontWeight: 500 }}>
                  RECEITAS · PRODUTOS
                </div>
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}
            className="desktop-nav">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => setPage(item.page)}
                className={`nav-link ${page === item.page ? "active" : ""}`}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: page === item.page ? theme.sage : theme.charcoal,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.3px",
                  padding: "4px 0",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setPage("shop")}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: "2px", right: "2px",
                  background: theme.terracotta,
                  color: theme.white,
                  borderRadius: "50%",
                  width: "16px", height: "16px",
                  fontSize: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700,
                }}>{cartCount}</span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px", display: "flex", flexDirection: "column",
                gap: "5px", alignItems: "flex-end",
              }}
              className="mobile-ham"
            >
              <span style={{ width: "24px", height: "2px", background: theme.charcoal, borderRadius: "2px", display: "block" }} />
              <span style={{ width: "16px", height: "2px", background: theme.charcoal, borderRadius: "2px", display: "block" }} />
              <span style={{ width: "20px", height: "2px", background: theme.charcoal, borderRadius: "2px", display: "block" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
          <div className="mobile-menu">
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                position: "absolute", top: "24px", right: "24px",
                background: "none", border: "none", fontSize: "24px", cursor: "pointer",
                color: theme.muted,
              }}
            >✕</button>
            <div style={{ marginBottom: "32px" }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "24px",
                fontWeight: 700,
                color: theme.charcoal,
              }}>Madame Baunilha</div>
            </div>
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => { setPage(item.page); setMenuOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "14px 0",
                  fontSize: "18px",
                  fontFamily: "'Cormorant Garamond', serif",
                  color: page === item.page ? theme.sage : theme.charcoal,
                  cursor: "pointer",
                  borderBottom: `1px solid ${theme.beige}`,
                  fontWeight: page === item.page ? 600 : 400,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 769px) { .mobile-ham { display: none !important; } }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const HomePage = ({ setPage, setSelectedRecipe, setSelectedProduct, addToCart }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <>
      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        background: `linear-gradient(145deg, ${theme.sageDark} 0%, ${theme.brown} 60%, ${theme.charcoal} 100%)`,
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1600&q=60)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
        }} />
        {/* Texture overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, rgba(30,92,90,0.75) 0%, rgba(74,55,40,0.5) 50%, rgba(37,26,20,0.88) 100%)`,
        }} />
        {/* Decorative circle */}
        <div style={{
          position: "absolute",
          top: "-200px", right: "-200px",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.sageLight}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-100px", left: "-100px",
          width: "400px", height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.terracotta}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ ...S.container, position: "relative", zIndex: 1, padding: "140px 20px 100px" }}>
          <div style={{ maxWidth: "700px" }}>
            <span style={{
              ...S.sectionLabel,
              color: `${theme.sageLight}`,
              display: "inline-block",
              marginBottom: "24px",
              letterSpacing: "4px",
            }}>
              ✦ Sabor que inspira, ingredientes que transformam
            </span>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(44px, 7vw, 78px)",
              fontWeight: 700,
              color: theme.white,
              lineHeight: 1.05,
              marginBottom: "28px",
              letterSpacing: "-0.5px",
            }}>
              Receitas com{" "}
              <em style={{ fontStyle: "italic", color: theme.terracottaLight }}>
                alma
              </em>{" "}
              e ingredientes que{" "}
              <em style={{ fontStyle: "italic", color: "#A8D5D3" }}>
                encantam
              </em>
            </h1>
            <p style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.75,
              marginBottom: "44px",
              fontWeight: 300,
              maxWidth: "560px",
            }}>
              Da Madame Baunilha para a sua cozinha — receitas exclusivas e produtos culinários
              selecionados com carinho para transformar cada refeição em memória afetiva.
            </p>

            {/* Search Bar */}
            <div style={{
              display: "flex",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "50px",
              border: "1px solid rgba(255,255,255,0.2)",
              overflow: "hidden",
              maxWidth: "500px",
              marginBottom: "36px",
            }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar receitas..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  padding: "16px 24px",
                  fontSize: "15px",
                  color: theme.white,
                  outline: "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button
                onClick={() => setPage("recipes")}
                style={{
                  background: theme.terracotta,
                  border: "none",
                  padding: "0 24px",
                  color: theme.white,
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                🔍
              </button>
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button
                onClick={() => setPage("recipes")}
                style={{ ...S.btnPrimary }}
                className="btn-hover"
              >
                Explorar Receitas ↗
              </button>
              <button
                onClick={() => setPage("shop")}
                style={{
                  ...S.btnOutline,
                  borderColor: "rgba(255,255,255,0.4)",
                  color: theme.white,
                }}
              >
                Ver Loja →
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          display: "flex",
          gap: "32px",
          zIndex: 1,
        }}>
          {[
            { num: "120+", label: "Receitas" },
            { num: "30+", label: "Produtos" },
            { num: "15k+", label: "Seguidores" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "28px",
                fontWeight: 700,
                color: theme.white,
              }}>{s.num}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <style>{`@media(max-width:640px) { .hero-stats { display:none!important; } }`}</style>
      </section>

      {/* Featured Recipes */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "48px" }}>
            <SectionHeader
              label="Em destaque"
              title="Receitas para se inspirar"
              subtitle="Selecionadas com cuidado para você"
            />
            <button
              onClick={() => setPage("recipes")}
              style={{ ...S.btnOutline, whiteSpace: "nowrap" }}
            >
              Ver todas →
            </button>
          </div>
          <div className="grid-3">
            {recipes.filter(r => r.featured).map(r => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onClick={(recipe) => { setSelectedRecipe(recipe); setPage("recipe"); }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={S.sectionAlt}>
        <div style={S.container}>
          <SectionHeader
            label="Navegue por"
            title="Categorias de receitas"
            centered
          />
          <div className="grid-3">
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                onClick={() => setPage("recipes")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bridge Section */}
      <section style={{
        background: `linear-gradient(135deg, ${theme.sage} 0%, ${theme.sageDark} 100%)`,
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle at 70% 50%, rgba(255,255,255,0.07) 0%, transparent 60%)`,
        }} />
        <div style={{ ...S.container, position: "relative" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}>
            <div>
              <span style={{ ...S.sectionLabel, color: "rgba(255,255,255,0.6)" }}>
                Receitas + Produtos
              </span>
              <h2 style={{
                ...S.sectionTitle,
                color: theme.white,
                marginBottom: "20px",
              }}>
                Do ingrediente à mesa, com intenção
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "16px", lineHeight: 1.7, marginBottom: "32px" }}>
                Cada receita é pensada junto com os produtos certos. Descubra como
                ingredientes de qualidade transformam preparações simples em experiências memoráveis.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setPage("shop")}
                  style={{ ...S.btnWhite }}
                >
                  Conhecer produtos →
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { icon: "🫒", text: "Ingredientes selecionados" },
                { icon: "📖", text: "Receitas exclusivas" },
                { icon: "🚚", text: "Entrega para todo Brasil" },
                { icon: "💚", text: "Produção responsável" },
              ].map(item => (
                <div key={item.text} style={{
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  padding: "20px",
                  backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{item.icon}</div>
                  <div style={{ color: theme.white, fontSize: "14px", fontWeight: 500 }}>{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.bridge-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* Products */}
      <section style={S.section}>
        <div style={S.container}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "48px" }}>
            <SectionHeader
              label="Nossa loja"
              title="Produtos culinários premium"
              subtitle="Ingredientes que fazem a diferença"
            />
            <button
              onClick={() => setPage("shop")}
              style={{ ...S.btnOutline, whiteSpace: "nowrap" }}
            >
              Ver todos →
            </button>
          </div>
          <div className="grid-4">
            {products.filter(p => p.featured).map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={(prod) => { setSelectedProduct(prod); setPage("product"); }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={S.sectionAlt}>
        <div style={S.container}>
          <SectionHeader
            label="Depoimentos"
            title="Quem já experimentou"
            subtitle="A comunidade que cozinha e confia"
            centered
          />
          <div className="grid-3">
            {testimonials.map(t => (
              <div key={t.id} style={{
                background: theme.white,
                borderRadius: "20px",
                padding: "32px",
                boxShadow: "0 2px 20px rgba(44,36,33,0.06)",
              }}>
                <div style={{ color: theme.terracotta, fontSize: "18px", marginBottom: "16px", letterSpacing: "2px" }}>
                  {"★".repeat(t.rating)}
                </div>
                <p style={{
                  fontSize: "15px",
                  color: theme.charcoal,
                  lineHeight: 1.7,
                  marginBottom: "24px",
                  fontStyle: "italic",
                }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "42px", height: "42px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${theme.terracotta}, ${theme.sage})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: theme.white,
                    fontSize: "14px",
                    fontWeight: 700,
                  }}>
                    {t.avatar}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{
        background: `linear-gradient(135deg, ${theme.charcoal} 0%, ${theme.sageDark} 100%)`,
        padding: "80px 0",
      }}>
        <div style={S.container}>
          <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ ...S.sectionLabel, color: theme.terracottaLight }}>Comunidade</span>
            <h2 style={{ ...S.sectionTitle, color: theme.white, marginBottom: "16px" }}>
              Receitas todo semana, direto no seu email
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "36px", lineHeight: 1.6 }}>
              Junte-se a mais de 15 mil pessoas que recebem receitas exclusivas,
              dicas de culinária e ofertas especiais.
            </p>
            {subscribed ? (
              <div style={{
                background: "rgba(122,155,122,0.2)",
                border: `1px solid ${theme.sage}`,
                borderRadius: "16px",
                padding: "20px",
                color: theme.sage,
                fontSize: "16px",
              }}>
                ✓ Perfeito! Você está na lista. Prepare-se para se inspirar!
              </div>
            ) : (
              <div style={{
                display: "flex",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "50px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
              }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail..."
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    padding: "16px 24px",
                    color: theme.white,
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  onClick={() => email && setSubscribed(true)}
                  style={{
                    background: theme.terracotta,
                    border: "none",
                    padding: "0 28px",
                    color: theme.white,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    letterSpacing: "0.5px",
                  }}
                >
                  Quero receber
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#1A1512",
        padding: "60px 0 32px",
        color: "rgba(255,255,255,0.6)",
      }}>
        <div style={S.container}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "40px",
            marginBottom: "48px",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: "32px", height: "32px",
                  background: theme.terracotta,
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px",
                }}>🌿</div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: theme.white,
                }}>Madame Baunilha</div>
              </div>
              <p style={{ fontSize: "14px", lineHeight: 1.7, maxWidth: "240px" }}>
                Receitas com alma e ingredientes com propósito. Um espaço para quem ama cozinhar bem.
              </p>
            </div>
            {[
              { title: "Conteúdo", links: ["Receitas", "Categorias", "Novidades", "Favoritos"] },
              { title: "Loja", links: ["Todos os Produtos", "Óleos & Azeites", "Temperos", "Kits"] },
              { title: "Marca", links: ["Sobre nós", "Contato", "Instagram", "WhatsApp"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "16px",
                  color: theme.white,
                  marginBottom: "16px",
                }}>{col.title}</div>
                {col.links.map(link => (
                  <div key={link} style={{ marginBottom: "8px", fontSize: "14px" }}>
                    <a href="#" style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}>{link}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}>
            <span style={{ fontSize: "13px" }}>© 2024 Madame Baunilha. Todos os direitos reservados.</span>
            <span style={{ fontSize: "13px" }}>Feito com 🌿 e muito carinho</span>
          </div>
        </div>
        <style>{`@media(max-width:768px){footer .grid-footer{grid-template-columns:1fr 1fr!important;}}`}</style>
      </footer>
    </>
  );
};

// ─── RECIPES PAGE ─────────────────────────────────────────────────────────────
const RecipesPage = ({ setPage, setSelectedRecipe }) => {
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const cats = ["Todas", ...Array.from(new Set(recipes.map(r => r.category)))];
  const filtered = recipes.filter(r =>
    (filter === "Todas" || r.category === filter) &&
    (r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <div style={{ paddingTop: "100px", background: theme.offwhite, minHeight: "280px", display: "flex", alignItems: "center" }}>
        <div style={S.container}>
          <span style={S.sectionLabel}>Todas as receitas</span>
          <h1 style={{ ...S.sectionTitle, marginBottom: "24px" }}>Receitas para cada momento</h1>
          <div style={{
            display: "flex",
            background: theme.white,
            borderRadius: "50px",
            overflow: "hidden",
            border: `1px solid ${theme.beige}`,
            maxWidth: "460px",
          }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar receitas..."
              style={{
                flex: 1,
                background: "none",
                border: "none",
                padding: "14px 20px",
                fontSize: "14px",
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                color: theme.charcoal,
              }}
            />
            <button style={{
              background: theme.terracotta,
              border: "none",
              padding: "0 20px",
              color: theme.white,
              cursor: "pointer",
              fontSize: "16px",
            }}>🔍</button>
          </div>
        </div>
      </div>

      <section style={{ ...S.section, paddingTop: "48px" }}>
        <div style={S.container}>
          {/* Filters */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "30px",
                  border: `1.5px solid ${filter === c ? theme.terracotta : theme.beige}`,
                  background: filter === c ? theme.terracotta : theme.white,
                  color: filter === c ? theme.white : theme.muted,
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid-3">
            {filtered.map(r => (
              <RecipeCard
                key={r.id}
                recipe={r}
                onClick={(recipe) => { setSelectedRecipe(recipe); setPage("recipe"); }}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: theme.muted }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍽️</div>
              <p>Nenhuma receita encontrada. Tente outra busca.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

// ─── RECIPE DETAIL ────────────────────────────────────────────────────────────
const RecipePage = ({ recipe, setPage, setSelectedRecipe, setSelectedProduct }) => {
  if (!recipe) return null;
  const related = recipes.filter(r => recipe.relatedRecipes?.includes(r.id));
  const relatedProds = products.filter(p => recipe.relatedProducts?.includes(p.id));

  return (
    <>
      {/* Hero */}
      <div style={{ position: "relative", height: "480px", marginTop: "72px" }}>
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(44,36,33,0.9) 0%, rgba(44,36,33,0.2) 50%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", bottom: "40px", left: "0", right: "0",
        }}>
          <div style={S.container}>
            <button
              onClick={() => setPage("recipes")}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: theme.white,
                borderRadius: "30px",
                padding: "8px 16px",
                fontSize: "13px",
                cursor: "pointer",
                marginBottom: "16px",
                backdropFilter: "blur(8px)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ← Voltar
            </button>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
              {[recipe.category, recipe.difficulty, recipe.time, recipe.servings].map(tag => (
                <span key={tag} style={{
                  background: "rgba(250,247,242,0.85)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "30px",
                  padding: "4px 14px",
                  fontSize: "12px",
                  color: theme.brown,
                  fontWeight: 500,
                }}>{tag}</span>
              ))}
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              color: theme.white,
              maxWidth: "700px",
            }}>{recipe.title}</h1>
          </div>
        </div>
      </div>

      <section style={{ ...S.section, paddingTop: "60px" }}>
        <div style={S.container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "60px" }}>
            {/* Ingredients */}
            <div>
              <div style={{
                background: theme.offwhite,
                borderRadius: "24px",
                padding: "32px",
                position: "sticky",
                top: "100px",
              }}>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  marginBottom: "24px",
                  color: theme.charcoal,
                }}>Ingredientes</h2>
                <p style={{ fontSize: "13px", color: theme.muted, marginBottom: "20px" }}>
                  Para {recipe.servings}
                </p>
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "10px 0",
                    borderBottom: i < recipe.ingredients.length - 1 ? `1px solid ${theme.beige}` : "none",
                  }}>
                    <div style={{
                      width: "6px", height: "6px",
                      borderRadius: "50%",
                      background: theme.terracotta,
                      marginTop: "7px",
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: "14px", color: theme.charcoal }}>{ing}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div>
              <p style={{ fontSize: "16px", color: theme.muted, lineHeight: 1.7, marginBottom: "40px" }}>
                {recipe.description}
              </p>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "26px",
                marginBottom: "32px",
              }}>Modo de Preparo</h2>
              {recipe.steps.map((step, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "28px",
                }}>
                  <div style={{
                    flexShrink: 0,
                    width: "36px", height: "36px",
                    borderRadius: "50%",
                    background: theme.terracotta,
                    color: theme.white,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}>{i + 1}</div>
                  <p style={{ fontSize: "15px", lineHeight: 1.75, paddingTop: "6px", color: theme.charcoal }}>
                    {step}
                  </p>
                </div>
              ))}

              {recipe.tip && (
                <div style={{
                  background: `${theme.sage}15`,
                  border: `1px solid ${theme.sage}40`,
                  borderRadius: "16px",
                  padding: "24px",
                  marginTop: "16px",
                }}>
                  <div style={{ color: theme.sage, fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>
                    💡 Dica da cozinheira
                  </div>
                  <p style={{ fontSize: "14px", color: theme.charcoal, lineHeight: 1.6 }}>{recipe.tip}</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProds.length > 0 && (
            <div style={{ marginTop: "80px" }}>
              <div style={{
                background: `linear-gradient(135deg, ${theme.terracotta}15 0%, ${theme.beige} 100%)`,
                borderRadius: "24px",
                padding: "40px",
                marginBottom: "24px",
              }}>
                <SectionHeader
                  label="Use nesta receita"
                  title="Produtos recomendados"
                  subtitle="Ingredientes que vão elevar ainda mais o resultado"
                />
                <div className="grid-3">
                  {relatedProds.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onClick={(prod) => { setSelectedProduct(prod); setPage("product"); }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Recipes */}
          {related.length > 0 && (
            <div style={{ marginTop: "60px" }}>
              <SectionHeader label="Veja também" title="Receitas relacionadas" />
              <div className="grid-3">
                {related.map(r => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    onClick={(rec) => { setSelectedRecipe(rec); setPage("recipe"); window.scrollTo(0, 0); }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

// ─── SHOP PAGE ────────────────────────────────────────────────────────────────
const ShopPage = ({ setPage, setSelectedProduct, addToCart }) => {
  const [filter, setFilter] = useState("Todos");
  const cats = ["Todos", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = filter === "Todos" ? products : products.filter(p => p.category === filter);

  return (
    <>
      <div style={{
        paddingTop: "72px",
        background: `linear-gradient(145deg, ${theme.sage} 0%, ${theme.sageDark} 40%, ${theme.brown} 100%)`,
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=1400&q=50)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }} />
        <div style={{ ...S.container, position: "relative", padding: "60px 20px" }}>
          <span style={{ ...S.sectionLabel, color: theme.terracottaLight }}>Nossa curadoria</span>
          <h1 style={{ ...S.sectionTitle, color: theme.white, marginBottom: "12px" }}>
            Produtos culinários premium
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
            Ingredientes selecionados para elevar sua cozinha
          </p>
        </div>
      </div>

      <section style={{ ...S.section, paddingTop: "48px" }}>
        <div style={S.container}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "30px",
                  border: `1.5px solid ${filter === c ? theme.terracotta : theme.beige}`,
                  background: filter === c ? theme.terracotta : theme.white,
                  color: filter === c ? theme.white : theme.muted,
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid-4">
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={(prod) => { setSelectedProduct(prod); setPage("product"); }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// ─── PRODUCT DETAIL ───────────────────────────────────────────────────────────
const ProductPage = ({ product, setPage, setSelectedRecipe, setSelectedProduct, addToCart }) => {
  if (!product) return null;
  const [added, setAdded] = useState(false);
  const related = products.filter(p => p.id !== product.id).slice(0, 3);
  const relatedRecs = recipes.filter(r => product.relatedRecipes?.includes(r.id));

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <section style={{ paddingTop: "100px", ...S.section }}>
        <div style={S.container}>
          <button
            onClick={() => setPage("shop")}
            style={{
              background: "none",
              border: `1px solid ${theme.beige}`,
              color: theme.muted,
              borderRadius: "30px",
              padding: "8px 16px",
              fontSize: "13px",
              cursor: "pointer",
              marginBottom: "40px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ← Voltar à loja
          </button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
            <div style={{ borderRadius: "24px", overflow: "hidden" }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100%", height: "480px", objectFit: "cover" }}
              />
            </div>
            <div>
              <span style={S.sectionLabel}>{product.category}</span>
              <h1 style={{ ...S.sectionTitle, marginBottom: "12px" }}>{product.name}</h1>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "42px",
                fontWeight: 700,
                color: theme.terracotta,
                marginBottom: "24px",
              }}>
                R$ {product.price.toFixed(2).replace(".", ",")}
              </div>
              <p style={{ fontSize: "16px", color: theme.muted, lineHeight: 1.7, marginBottom: "32px" }}>
                {product.description}
              </p>

              <div style={{ marginBottom: "32px" }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "18px",
                  marginBottom: "16px",
                }}>Diferenciais</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {product.benefits.map(b => (
                    <div key={b} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      background: theme.offwhite,
                      borderRadius: "12px",
                      fontSize: "13px",
                      color: theme.charcoal,
                    }}>
                      <span style={{ color: theme.sage }}>✓</span> {b}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={handleAdd}
                  style={{
                    ...S.btnPrimary,
                    background: added ? theme.sage : theme.terracotta,
                    flex: 1,
                    justifyContent: "center",
                    fontSize: "15px",
                    padding: "16px 32px",
                    transition: "background 0.3s",
                  }}
                >
                  {added ? "✓ Adicionado!" : "Adicionar ao carrinho"}
                </button>
                <button style={{
                  width: "52px", height: "52px",
                  border: `2px solid ${theme.beige}`,
                  borderRadius: "50%",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                }}>♡</button>
              </div>

              {/* WhatsApp CTA */}
              <div style={{
                marginTop: "24px",
                padding: "16px 20px",
                background: "#E8F5E9",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
                <span style={{ fontSize: "24px" }}>💬</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#2E7D32" }}>Dúvidas? Fale pelo WhatsApp</div>
                  <div style={{ fontSize: "12px", color: "#4CAF50" }}>Resposta em até 2 horas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Recipes */}
          {relatedRecs.length > 0 && (
            <div style={{ marginTop: "80px" }}>
              <SectionHeader label="Use este produto em" title="Receitas sugeridas" />
              <div className="grid-3">
                {relatedRecs.map(r => (
                  <RecipeCard
                    key={r.id}
                    recipe={r}
                    onClick={(rec) => { setSelectedRecipe(rec); setPage("recipe"); }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          <div style={{ marginTop: "60px" }}>
            <SectionHeader label="Explore também" title="Outros produtos" />
            <div className="grid-3">
              {related.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={(prod) => { setSelectedProduct(prod); setPage("product"); window.scrollTo(0, 0); }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
const AboutPage = () => (
  <>
    <div style={{
      paddingTop: "72px",
      background: theme.offwhite,
      minHeight: "400px",
      display: "flex",
      alignItems: "center",
    }}>
      <div style={S.container}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
          padding: "80px 0",
        }}>
          <div>
            <span style={S.sectionLabel}>Nossa história</span>
            <h1 style={{ ...S.sectionTitle, marginBottom: "24px" }}>
              Nascemos da paixão por cozinhar bem e com intenção
            </h1>
            <p style={{ fontSize: "16px", color: theme.muted, lineHeight: 1.8, marginBottom: "20px" }}>
              Madame Baunilha surgiu da crença de que a cozinha é um dos lugares mais amorosos da casa.
              Que um prato bem feito conecta pessoas, desperta memórias e transforma o cotidiano em algo especial.
            </p>
            <p style={{ fontSize: "16px", color: theme.muted, lineHeight: 1.8 }}>
              Aqui você encontra receitas testadas com carinho e produtos culinários selecionados com rigor,
              para que cada refeição seja uma experiência que vale a pena.
            </p>
          </div>
          <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 60px rgba(44,36,33,0.15)" }}>
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
              alt="Nossa cozinha"
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>

    <section style={S.section}>
      <div style={S.container}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "32px",
          marginBottom: "80px",
        }}>
          {[
            {
              icon: "🌿",
              title: "Ingredientes com propósito",
              text: "Cada produto da nossa loja é cuidadosamente escolhido por qualidade, origem e impacto real na receita.",
            },
            {
              icon: "📖",
              title: "Receitas que funcionam",
              text: "Testamos cada receita diversas vezes antes de publicar. Queremos que o seu resultado seja perfeito.",
            },
            {
              icon: "💛",
              title: "Comunidade apaixonada",
              text: "Mais de 15 mil pessoas que amam cozinhar e descobrir novas formas de tornar a comida uma arte.",
            },
          ].map(item => (
            <div key={item.title} style={{
              textAlign: "center",
              padding: "40px 32px",
              background: theme.white,
              borderRadius: "24px",
              boxShadow: "0 2px 20px rgba(44,36,33,0.06)",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>{item.icon}</div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "20px",
                marginBottom: "12px",
              }}>{item.title}</h3>
              <p style={{ color: theme.muted, fontSize: "14px", lineHeight: 1.7 }}>{item.text}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: `linear-gradient(135deg, ${theme.sage} 0%, ${theme.brown} 100%)`,
          borderRadius: "32px",
          padding: "60px",
          textAlign: "center",
          color: theme.white,
        }}>
          <span style={{ ...S.sectionLabel, color: "#A8D5D3" }}>Nossa missão</span>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 700,
            color: theme.white,
            maxWidth: "600px",
            margin: "0 auto 24px",
            lineHeight: 1.3,
          }}>
            "Fazer da cozinha um espaço de criatividade, afeto e prazer genuíno."
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", maxWidth: "500px", margin: "0 auto" }}>
            Cada receita e cada produto que criamos carrega essa intenção.
          </p>
        </div>
      </div>
    </section>
  </>
);

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <section style={{ paddingTop: "120px", ...S.section }}>
      <div style={S.container}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: "80px",
          alignItems: "start",
        }}>
          <div>
            <span style={S.sectionLabel}>Fale conosco</span>
            <h1 style={{ ...S.sectionTitle, marginBottom: "20px" }}>Adoramos conversar sobre comida</h1>
            <p style={{ color: theme.muted, lineHeight: 1.7, marginBottom: "40px" }}>
              Dúvidas sobre pedidos, sugestões de receitas ou parcerias? Estamos aqui!
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                { icon: "✉️", label: "E-mail", value: "oi@madamebaunilha.com.br" },
                { icon: "📍", label: "Localização", value: "São Paulo, SP" },
                { icon: "📸", label: "Instagram", value: "@madamebaunilha" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "44px", height: "44px",
                    background: theme.offwhite,
                    borderRadius: "12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: "12px", color: theme.muted, marginBottom: "2px" }}>{item.label}</div>
                    <div style={{ fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <div style={{
              marginTop: "32px",
              background: "#E8F5E9",
              borderRadius: "16px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}>
              <span style={{ fontSize: "32px" }}>💬</span>
              <div>
                <div style={{ fontWeight: 600, color: "#2E7D32", marginBottom: "4px" }}>
                  WhatsApp
                </div>
                <div style={{ fontSize: "14px", color: "#388E3C" }}>
                  Atendimento de seg. a sex. das 9h às 18h
                </div>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    background: "#25D366",
                    color: theme.white,
                    borderRadius: "30px",
                    padding: "6px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  Chamar no WhatsApp →
                </a>
              </div>
            </div>
          </div>

          <div style={{
            background: theme.white,
            borderRadius: "28px",
            padding: "48px",
            boxShadow: "0 4px 40px rgba(44,36,33,0.08)",
          }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "24px",
                  marginBottom: "12px",
                }}>Mensagem enviada!</h3>
                <p style={{ color: theme.muted }}>Retornamos em até 24 horas úteis.</p>
              </div>
            ) : (
              <>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "24px",
                  marginBottom: "32px",
                }}>Envie sua mensagem</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {[
                    { label: "Seu nome", key: "name", type: "text", placeholder: "Maria Silva" },
                    { label: "E-mail", key: "email", type: "email", placeholder: "maria@email.com" },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: theme.charcoal,
                        marginBottom: "8px",
                        letterSpacing: "0.3px",
                      }}>{field.label}</label>
                      <input
                        type={field.type}
                        value={form[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        style={{
                          width: "100%",
                          padding: "14px 18px",
                          border: `1.5px solid ${theme.beige}`,
                          borderRadius: "12px",
                          fontSize: "14px",
                          fontFamily: "'DM Sans', sans-serif",
                          outline: "none",
                          transition: "border-color 0.2s",
                          background: theme.cream,
                          color: theme.charcoal,
                        }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: theme.charcoal,
                      marginBottom: "8px",
                    }}>Mensagem</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Escreva sua mensagem aqui..."
                      rows={5}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        border: `1.5px solid ${theme.beige}`,
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontFamily: "'DM Sans', sans-serif",
                        outline: "none",
                        resize: "vertical",
                        background: theme.cream,
                        color: theme.charcoal,
                      }}
                    />
                  </div>
                  <button
                    onClick={() => form.name && form.email && form.message && setSent(true)}
                    style={{ ...S.btnPrimary, justifyContent: "center", padding: "16px" }}
                  >
                    Enviar mensagem ✦
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <style>{fontStyle}</style>
      <Header page={page} setPage={setPage} cartCount={cartCount} />
      <main>
        {page === "home" && (
          <HomePage
            setPage={setPage}
            setSelectedRecipe={setSelectedRecipe}
            setSelectedProduct={setSelectedProduct}
            addToCart={addToCart}
          />
        )}
        {page === "recipes" && (
          <RecipesPage setPage={setPage} setSelectedRecipe={setSelectedRecipe} />
        )}
        {page === "recipe" && (
          <RecipePage
            recipe={selectedRecipe}
            setPage={setPage}
            setSelectedRecipe={setSelectedRecipe}
            setSelectedProduct={setSelectedProduct}
          />
        )}
        {page === "shop" && (
          <ShopPage
            setPage={setPage}
            setSelectedProduct={setSelectedProduct}
            addToCart={addToCart}
          />
        )}
        {page === "product" && (
          <ProductPage
            product={selectedProduct}
            setPage={setPage}
            setSelectedRecipe={setSelectedRecipe}
            setSelectedProduct={setSelectedProduct}
            addToCart={addToCart}
          />
        )}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
      </main>
    </>
  );
}