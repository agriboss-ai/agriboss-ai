import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  deepGreen: "#1B4332", midGreen: "#2D6A4F", leaf: "#40916C",
  fresh: "#74C69D", pale: "#D8F3DC",
  earth: "#8B4513", earthMid: "#C68B5A", earthPale: "#F5E6D3",
  gold: "#F4A261", goldLight: "#FFDDA1",
  sky: "#1A6B9A", skyPale: "#E8F4FD",
  white: "#FAFAF8", off: "#F0EDE6",
  dark: "#1A1A1A", mid: "#4A4A4A", light: "#8A8A8A",
};

/* ─────────────────────────────────────────────
   BASE DE DONNÉES — CULTURES TOGOLAISES
───────────────────────────────────────────── */
const CULTURES = {
  tomate: {
    nom: "Tomate", emoji: "🍅", saison: "Oct–Jan / Avr–Jun",
    regions: ["Maritime", "Plateaux", "Centrale"],
    rendement: "15–25 t/ha", cycle: "90–120 jours",
    intrants_ha: { semences: 8000, engrais: 45000, pesticides: 30000, maindoeuvre: 60000, total: 143000 },
    prix_moyen: { min: 100, max: 350, unite: "FCFA/kg" },
    maladies: ["Mildiou", "Alternariose", "Fusariose", "Virus de la tomate"],
    conseils: "Arrosage régulier sans excès. Tuteurer dès 20cm. Traitement préventif anti-mildiou toutes les 2 semaines.",
  },
  mais: {
    nom: "Maïs", emoji: "🌽", saison: "Avr–Jul / Sep–Nov",
    regions: ["Toutes régions"],
    rendement: "2–4 t/ha", cycle: "90–110 jours",
    intrants_ha: { semences: 12000, engrais: 38000, pesticides: 15000, maindoeuvre: 45000, total: 110000 },
    prix_moyen: { min: 150, max: 280, unite: "FCFA/kg" },
    maladies: ["Chenille légionnaire", "Charbon du maïs", "Rouille", "Helminthosporiose"],
    conseils: "Écartement 75×25cm. Apport NPK au semis, urée à 45 jours. Surveiller chenille légionnaire dès la levée.",
  },
  igname: {
    nom: "Igname", emoji: "🥔", saison: "Fév–Mar (semis)",
    regions: ["Centrale", "Kara", "Savanes"],
    rendement: "10–20 t/ha", cycle: "240–300 jours",
    intrants_ha: { semences: 120000, engrais: 30000, pesticides: 12000, maindoeuvre: 80000, total: 242000 },
    prix_moyen: { min: 200, max: 600, unite: "FCFA/kg" },
    maladies: ["Anthracnose", "Nématodes", "Viroses", "Pourriture sèche"],
    conseils: "Utiliser des semenceaux sains de 300–400g. Butter régulièrement. L'igname est très sensible à l'excès d'eau.",
  },
  manioc: {
    nom: "Manioc", emoji: "🌿", saison: "Toute l'année",
    regions: ["Maritime", "Plateaux", "Centrale"],
    rendement: "8–15 t/ha", cycle: "9–18 mois",
    intrants_ha: { semences: 25000, engrais: 20000, pesticides: 8000, maindoeuvre: 50000, total: 103000 },
    prix_moyen: { min: 80, max: 180, unite: "FCFA/kg" },
    maladies: ["Mosaïque africaine", "Cochenille farineuse", "Bactériose", "Acarien vert"],
    conseils: "Planter des boutures de 25–30cm. Variétés résistantes à la mosaïque recommandées. Désherbage dans les 3 premiers mois.",
  },
  soja: {
    nom: "Soja", emoji: "🫘", saison: "Jun–Sep",
    regions: ["Centrale", "Kara", "Plateaux"],
    rendement: "1–2 t/ha", cycle: "90–120 jours",
    intrants_ha: { semences: 18000, engrais: 15000, pesticides: 10000, maindoeuvre: 35000, total: 78000 },
    prix_moyen: { min: 350, max: 550, unite: "FCFA/kg" },
    maladies: ["Mildiou du soja", "Sclérotiniose", "Pucerons", "Mouche du semis"],
    conseils: "Inoculation des semences avec rhizobium recommandée. Bonne fixation d'azote = moins d'engrais. Récolter dès que 95% des gousses sont sèches.",
  },
  piment: {
    nom: "Piment", emoji: "🌶️", saison: "Toute l'année (irrigué)",
    regions: ["Maritime", "Plateaux"],
    rendement: "8–15 t/ha", cycle: "90–150 jours",
    intrants_ha: { semences: 15000, engrais: 40000, pesticides: 25000, maindoeuvre: 55000, total: 135000 },
    prix_moyen: { min: 500, max: 1200, unite: "FCFA/kg" },
    maladies: ["Anthracnose", "Phytophthora", "Thrips", "Virus du piment"],
    conseils: "Pépinière 4–6 semaines avant repiquage. Irrigation goutte-à-goutte idéale. Marché à forte valeur ajoutée — privilégier la commercialisation groupée.",
  },
};

/* ─────────────────────────────────────────────
   PRIX DU MARCHÉ — DONNÉES PRÉCHARGÉES
   Mis à jour : Mai 2026
───────────────────────────────────────────── */
const MARCHE = {
  lome: {
    nom: "Marché de Lomé", region: "Maritime", emoji: "🏙️",
    prix: {
      tomate: { val: 250, unite: "/kg", tendance: "↑", note: "Haute saison" },
      mais: { val: 200, unite: "/kg", tendance: "→", note: "Prix stable" },
      igname: { val: 400, unite: "/kg", tendance: "↑", note: "Forte demande" },
      manioc: { val: 120, unite: "/kg", tendance: "→", note: "Abondant" },
      soja: { val: 450, unite: "/kg", tendance: "↑", note: "Demande export" },
      piment: { val: 800, unite: "/kg", tendance: "↑", note: "Pénurie locale" },
    }
  },
  sokode: {
    nom: "Marché de Sokodé", region: "Centrale", emoji: "🌄",
    prix: {
      tomate: { val: 180, unite: "/kg", tendance: "→", note: "Bonne offre" },
      mais: { val: 170, unite: "/kg", tendance: "↓", note: "Post-récolte" },
      igname: { val: 320, unite: "/kg", tendance: "→", note: "Saison normale" },
      manioc: { val: 90, unite: "/kg", tendance: "→", note: "Prix bas" },
      soja: { val: 400, unite: "/kg", tendance: "↑", note: "Collecteurs actifs" },
      piment: { val: 650, unite: "/kg", tendance: "→", note: "Marché régional" },
    }
  },
  kara: {
    nom: "Marché de Kara", region: "Kara", emoji: "⛰️",
    prix: {
      tomate: { val: 200, unite: "/kg", tendance: "↑", note: "Demande urbaine" },
      mais: { val: 185, unite: "/kg", tendance: "→", note: "Stock moyen" },
      igname: { val: 280, unite: "/kg", tendance: "↑", note: "Zone productrice" },
      manioc: { val: 100, unite: "/kg", tendance: "→", note: "Stable" },
      soja: { val: 420, unite: "/kg", tendance: "↑", note: "Bonne demande" },
      piment: { val: 700, unite: "/kg", tendance: "↑", note: "Pénurie" },
    }
  },
  aneho: {
    nom: "Marché d'Anéhо", region: "Maritime", emoji: "🌊",
    prix: {
      tomate: { val: 230, unite: "/kg", tendance: "→", note: "Prix côtier" },
      mais: { val: 210, unite: "/kg", tendance: "→", note: "Stable" },
      igname: { val: 450, unite: "/kg", tendance: "↑", note: "Exportation" },
      manioc: { val: 130, unite: "/kg", tendance: "→", note: "Normal" },
      soja: { val: 480, unite: "/kg", tendance: "↑", note: "Export Bénin" },
      piment: { val: 900, unite: "/kg", tendance: "↑", note: "Très demandé" },
    }
  },
};

/* ─────────────────────────────────────────────
   WHATSAPP CONFIG
───────────────────────────────────────────── */
const WA_NUMBER = "22890000000"; // Numéro placeholder Big Village Farm
const WA_MESSAGE = encodeURIComponent(
  `Bonjour Agriboss AI 🌾\n\nJe suis agriculteur au Togo et je veux utiliser votre assistant intelligent.\n\nMon nom : \nMa région : \nMes cultures principales : \n\nJe veux de l'aide sur : [ ] Agronomie  [ ] Finances  [ ] Prix du marché`
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

/* ─────────────────────────────────────────────
   SYSTEM PROMPT ENRICHI
───────────────────────────────────────────── */
const SYSTEM_PROMPT = `Tu es Agriboss AI, l'assistant agricole intelligent d'Agriboss Academy (Big Village Farm, Togo). Tu es le conseiller de confiance de milliers d'agriculteurs togolais.

## BASE DE DONNÉES CULTURES TOGOLAISES

${Object.entries(CULTURES).map(([key, c]) => `
### ${c.nom} ${c.emoji}
- Saison : ${c.saison}
- Régions : ${c.regions.join(", ")}
- Rendement typique : ${c.rendement}
- Cycle : ${c.cycle}
- Budget indicatif/ha : ${c.intrants_ha.total.toLocaleString("fr-FR")} FCFA (semences ${c.intrants_ha.semences.toLocaleString()}, engrais ${c.intrants_ha.engrais.toLocaleString()}, pesticides ${c.intrants_ha.pesticides.toLocaleString()}, main-d'œuvre ${c.intrants_ha.maindoeuvre.toLocaleString()})
- Prix marché : ${c.prix_moyen.min}–${c.prix_moyen.max} ${c.prix_moyen.unite}
- Maladies fréquentes : ${c.maladies.join(", ")}
- Conseil clé : ${c.conseils}
`).join("")}

## PRIX DU MARCHÉ (Mai 2026 — en FCFA)

${Object.entries(MARCHE).map(([key, m]) => `
### ${m.nom} (${m.region})
${Object.entries(m.prix).map(([culture, p]) => `- ${CULTURES[culture]?.nom || culture} : ${p.val} FCFA${p.unite} ${p.tendance} (${p.note})`).join("\n")}
`).join("")}

## TES 3 DOMAINES D'ACTION

**1. AGRONOMIE** : Diagnostic maladies/ravageurs/carences avec recommandations de traitement (produits disponibles au Togo). Calendriers culturaux. Bonnes pratiques par culture et par région.

**2. GESTION FINANCIÈRE** : Quand l'agriculteur mentionne une dépense, calcule le montant TOTAL (quantité × prix unitaire) et inclus OBLIGATOIREMENT ce bloc dans ta réponse sur une seule ligne :
[DEPENSE: {"categorie":"intrants","description":"3 sacs engrais NPK","montant":54000,"date":"aujourd'hui"}]
IMPORTANT : montant = quantité × prix unitaire. Ex: 3 sacs à 18 000 FCFA = 54 000 FCFA total.
Catégories : intrants, main-oeuvre, transport, équipement, location, autre

**3. MARCHÉ** : Prix actuels par marché et par culture. Conseils de vente et commercialisation. Opportunités de transformation à valeur ajoutée.

## RÈGLES
- Toujours en français, simple et pratique
- Réponses max 200 mots sauf si demande d'analyse complète
- Chaleureux et encourageant comme un conseiller de terrain
- Recommander des produits disponibles localement au Togo
- Mentionner les prix en FCFA
- Si question sur les prix : citer le marché le plus proche selon la région de l'agriculteur`;

/* ─────────────────────────────────────────────
   COMPOSANTS UI
───────────────────────────────────────────── */
const MODULES = [
  { id: "agro", icon: "🌱", label: "Agronomie", color: C.leaf, bg: C.pale },
  { id: "finance", icon: "💰", label: "Finances", color: C.earth, bg: C.earthPale },
  { id: "marche", icon: "📊", label: "Marché", color: C.sky, bg: C.skyPale },
  { id: "qr", icon: "📲", label: "Rejoindre", color: "#6B35A8", bg: "#F3E8FF" },
];

const SUGGESTIONS = {
  agro: ["Mes feuilles de tomates jaunissent", "Traitement chenille légionnaire maïs", "Calendrier cultural igname — région Kara"],
  finance: ["J'ai acheté 3 sacs NPK à 18 000 FCFA", "Budget pour 1 hectare de maïs ?", "Main d'œuvre : 4 personnes à 3 500 FCFA"],
  marche: ["Prix tomate à Lomé aujourd'hui ?", "Où vendre mon soja au meilleur prix ?", "Comparaison prix igname Kara vs Lomé"],
  qr: [],
};

function parseExpense(text) {
  const m1 = text.match(/\[DEPENSE:\s*(\{[\s\S]*?\})\]/);
  if (m1) { try { return JSON.parse(m1[1]); } catch {} }
  const m2 = text.match(/DEPENSE:\s*(\{[\s\S]*?\})/);
  if (m2) { try { return JSON.parse(m2[1]); } catch {} }
  return null;
}
function cleanMsg(text) {
  return text
    .replace(/\[DEPENSE:\s*\{[\s\S]*?\}\]/g, "")
    .replace(/DEPENSE:\s*\{[\s\S]*?\}/g, "")
    .trim();
}
function renderMD(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

function ExpenseTag({ exp }) {
  const icons = { intrants: "🌿", "main-oeuvre": "👷", transport: "🚛", équipement: "⚙️", location: "🏡", autre: "📦" };
  return (
    <div style={{ background: C.earthPale, border: `1.5px solid ${C.earthMid}`, borderRadius: 10, padding: "9px 13px", marginTop: 7, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 17 }}>{icons[exp.categorie] || "📦"}</span>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600, fontSize: 13, color: C.earth }}>{exp.description}</div>
          <div style={{ fontSize: 11, color: C.light, textTransform: "capitalize" }}>{exp.categorie}</div>
        </div>
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: C.earth }}>
        {exp.montant.toLocaleString("fr-FR")} <span style={{ fontSize: 10, fontWeight: 400 }}>FCFA</span>
      </div>
    </div>
  );
}

/* ─── DASHBOARD ─── */
function Dashboard({ expenses }) {
  const total = expenses.reduce((s, e) => s + e.montant, 0);
  const byCat = expenses.reduce((a, e) => { a[e.categorie] = (a[e.categorie] || 0) + e.montant; return a; }, {});
  const maxCat = Object.entries(byCat).sort((a, b) => b[1] - a[1]);

  if (!expenses.length) return (
    <div style={{ textAlign: "center", padding: "40px 20px", background: C.pale, borderRadius: 16, border: `2px dashed ${C.fresh}`, margin: "0 16px" }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>💰</div>
      <div style={{ fontWeight: 600, color: C.deepGreen, marginBottom: 6 }}>Aucune dépense enregistrée</div>
      <div style={{ fontSize: 13, color: C.light }}>Dites à Agriboss AI ce que vous avez acheté — il enregistre automatiquement.</div>
      <div style={{ fontSize: 12, color: C.leaf, marginTop: 8, fontStyle: "italic" }}>"J'ai acheté 2 sacs d'engrais à 15 000 FCFA"</div>
    </div>
  );

  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ background: `linear-gradient(135deg, ${C.deepGreen}, ${C.midGreen})`, borderRadius: 16, padding: "18px 20px", color: C.white, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", opacity: 0.65, marginBottom: 2 }}>Total dépenses</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, marginBottom: 14 }}>
          {total.toLocaleString("fr-FR")} <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.75 }}>FCFA</span>
        </div>
        {maxCat.map(([cat, amt]) => {
          const pct = Math.round((amt / total) * 100);
          return (
            <div key={cat} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                <span style={{ opacity: 0.8, textTransform: "capitalize" }}>{cat}</span>
                <span style={{ fontWeight: 600 }}>{amt.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 4, height: 5 }}>
                <div style={{ background: C.fresh, borderRadius: 4, height: 5, width: `${pct}%`, transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.mid, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Détail</div>
      {expenses.map((e, i) => <ExpenseTag key={i} exp={e} />)}
    </div>
  );
}

/* ─── PRIX MARCHÉ ─── */
function MarcheView() {
  const [selected, setSelected] = useState("lome");
  const m = MARCHE[selected];
  const tendColors = { "↑": "#16A34A", "→": C.light, "↓": "#DC2626" };

  return (
    <div style={{ padding: "0 16px", overflow: "auto", flex: 1 }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.deepGreen, marginBottom: 4 }}>Prix du Marché</div>
      <div style={{ fontSize: 12, color: C.light, marginBottom: 14 }}>Données actualisées — Mai 2026</div>

      {/* Sélecteur marché */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", marginBottom: 16, paddingBottom: 4 }}>
        {Object.entries(MARCHE).map(([key, mk]) => (
          <button key={key} onClick={() => setSelected(key)} style={{
            flexShrink: 0, border: "none", cursor: "pointer", borderRadius: 20, padding: "7px 14px",
            background: selected === key ? C.deepGreen : C.pale,
            color: selected === key ? C.white : C.deepGreen,
            fontSize: 12, fontWeight: 600, transition: "all 0.2s",
          }}>
            {mk.emoji} {mk.nom.replace("Marché de ", "").replace("Marché d'", "")}
          </button>
        ))}
      </div>

      {/* Prix du marché sélectionné */}
      <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ background: `linear-gradient(135deg, ${C.deepGreen}, ${C.midGreen})`, padding: "12px 16px" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: C.white, fontSize: 16 }}>{m.nom}</div>
          <div style={{ fontSize: 11, color: C.fresh }}>{m.region}</div>
        </div>
        {Object.entries(m.prix).map(([culture, p], i) => (
          <div key={culture} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "11px 16px", borderBottom: i < Object.keys(m.prix).length - 1 ? `1px solid ${C.off}` : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{CULTURES[culture]?.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>{CULTURES[culture]?.nom || culture}</div>
                <div style={{ fontSize: 11, color: C.light }}>{p.note}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: C.deepGreen }}>
                {p.val} <span style={{ fontSize: 11, fontWeight: 400 }}>FCFA{p.unite}</span>
              </div>
              <div style={{ fontSize: 13, color: tendColors[p.tendance] }}>{p.tendance}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Fiches cultures rapides */}
      <div style={{ marginTop: 20, marginBottom: 8, fontSize: 13, fontWeight: 600, color: C.mid, textTransform: "uppercase", letterSpacing: 1 }}>
        Fiches Cultures
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {Object.values(CULTURES).map(c => (
          <div key={c.nom} style={{ background: C.white, borderRadius: 12, padding: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: `1px solid ${C.off}` }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{c.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.deepGreen, marginBottom: 2 }}>{c.nom}</div>
            <div style={{ fontSize: 11, color: C.light, marginBottom: 6 }}>{c.saison}</div>
            <div style={{ fontSize: 11, color: C.earth, fontWeight: 600 }}>
              Budget: {(c.intrants_ha.total / 1000).toFixed(0)}k FCFA/ha
            </div>
            <div style={{ fontSize: 11, color: C.leaf }}>Rdt: {c.rendement}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── QR CODE + WHATSAPP ─── */
function QRView() {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard?.writeText(WA_LINK).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // QR code généré via API publique (pas de dépendance externe)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(WA_LINK)}&color=1B4332&bgcolor=FAFAF8`;

  return (
    <div style={{ padding: "0 20px", overflow: "auto", flex: 1 }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.deepGreen, marginBottom: 4 }}>
        Rejoindre Agriboss AI
      </div>
      <div style={{ fontSize: 13, color: C.light, marginBottom: 20 }}>
        Partagez ce QR code avec les agriculteurs du réseau Big Village Farm
      </div>

      {/* QR Code */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{
          display: "inline-block", padding: 16, background: C.white,
          borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          border: `3px solid ${C.pale}`,
        }}>
          <img src={qrUrl} alt="QR Code WhatsApp Agriboss AI" width={200} height={200}
            style={{ borderRadius: 10, display: "block" }}
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: C.light }}>Scanner avec l'appareil photo</div>
      </div>

      {/* Message pré-rempli preview */}
      <div style={{ background: "#E7FFDB", border: "1px solid #A8D8A8", borderRadius: 14, padding: "14px 16px", marginBottom: 16, position: "relative" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#25D366", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          💬 Message pré-rempli WhatsApp
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: C.dark, lineHeight: 1.6 }}>
          Bonjour Agriboss AI 🌾<br /><br />
          Je suis agriculteur au Togo et je veux utiliser votre assistant intelligent.<br /><br />
          Mon nom : ___<br />
          Ma région : ___<br />
          Mes cultures : ___<br /><br />
          Aide souhaitée : [ ] Agronomie [ ] Finances [ ] Marché
        </div>
      </div>

      {/* Boutons d'action */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <a href={WA_LINK} target="_blank" rel="noreferrer" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: "#25D366", color: C.white, borderRadius: 14, padding: "14px",
          fontWeight: 700, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 14px rgba(37,211,102,0.35)",
        }}>
          <span style={{ fontSize: 20 }}>📲</span> Ouvrir dans WhatsApp
        </a>
        <button onClick={copyLink} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: copied ? C.pale : C.off, color: copied ? C.deepGreen : C.mid,
          border: `1.5px solid ${copied ? C.leaf : C.off}`,
          borderRadius: 14, padding: "13px", fontWeight: 600, fontSize: 14, cursor: "pointer",
          transition: "all 0.2s",
        }}>
          {copied ? "✅ Lien copié !" : "📋 Copier le lien"}
        </button>
      </div>

      {/* Instructions terrain */}
      <div style={{ background: C.earthPale, border: `1px solid ${C.earthMid}40`, borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
        <div style={{ fontWeight: 700, color: C.earth, fontSize: 13, marginBottom: 10 }}>📋 Instructions pour le terrain</div>
        {[
          ["Imprimer le QR code", "Format A5 ou A4 plastifié — résistant aux intempéries"],
          ["Afficher dans les coopératives", "Points de passage des agriculteurs : marchés, magasins d'intrants"],
          ["Former 1 agriculteur leader", "Il aide les autres à scanner et s'inscrire"],
          ["Radio communautaire", "Lire le numéro WhatsApp en éwé et kabyè"],
        ].map(([titre, desc]) => (
          <div key={titre} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.earth, flexShrink: 0, marginTop: 5 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.dark }}>{titre}</div>
              <div style={{ fontSize: 12, color: C.light }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats cibles */}
      <div style={{ background: `linear-gradient(135deg, ${C.deepGreen}, ${C.midGreen})`, borderRadius: 14, padding: "16px", color: C.white, marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.65, marginBottom: 10 }}>Objectif Phase 1</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[["50", "Agriculteurs pilotes"], ["5", "Coopératives"], ["3", "Cultures couvertes"], ["80%", "Satisfaction cible"]].map(([val, label]) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700 }}>{val}</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   APP PRINCIPALE
───────────────────────────────────────────── */
export default function AgribossAI() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Bonjour ! Je suis **Agriboss AI** 🌾\n\nVotre conseiller agricole intelligent pour le Togo. Je connais vos cultures, les prix des marchés de Lomé, Sokodé, Kara et Anéhо, et je peux vous aider à gérer vos dépenses.\n\nComment puis-je vous aider aujourd'hui ?",
    clean: "Bonjour ! Je suis **Agriboss AI** 🌾\n\nVotre conseiller agricole intelligent pour le Togo. Je connais vos cultures, les prix des marchés de Lomé, Sokodé, Kara et Anéhо, et je peux vous aider à gérer vos dépenses.\n\nComment puis-je vous aider aujourd'hui ?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModule, setActiveModule] = useState("agro");
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState("chat"); // chat | dashboard
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    const userMsg = { role: "user", content: userText };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    try {
      const GROQ_KEY = process.env.REACT_APP_GROQ_KEY || "";
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...next.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      const data = await res.json();
      const full = data.choices?.[0]?.message?.content || "Erreur de connexion.";
      const expense = parseExpense(full);
      if (expense) setExpenses(p => [...p, expense]);
      setMessages(p => [...p, { role: "assistant", content: full, clean: cleanMsg(full), expense }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Erreur de connexion. Veuillez réessayer.", clean: "Erreur de connexion. Veuillez réessayer." }]);
    }
    setLoading(false);
  }

  const mod = MODULES.find(m => m.id === activeModule);
  const isSpecialView = activeModule === "marche" || activeModule === "qr";

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: C.off, minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", boxShadow: "0 0 60px rgba(0,0,0,0.15)", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:${C.fresh};border-radius:4px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .msg{animation:up .25s ease forwards}
        .dot{animation:pulse 1.4s ease infinite}
        a{color:inherit}
      `}</style>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(160deg,${C.deepGreen} 0%,${C.midGreen} 100%)`, padding: "18px 18px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(116,198,157,.1)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: C.fresh, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌾</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: C.white, letterSpacing: -.5 }}>Agriboss AI</div>
              <div style={{ fontSize: 10, color: C.fresh, letterSpacing: 1.2, textTransform: "uppercase" }}>Assistant Agricole Intelligent</div>
            </div>
          </div>
          {activeModule === "finance" && (
            <button onClick={() => setView(v => v === "chat" ? "dashboard" : "chat")} style={{
              background: view === "dashboard" ? C.gold : "rgba(255,255,255,.12)",
              border: "none", borderRadius: 10, padding: "7px 12px", cursor: "pointer",
              color: view === "dashboard" ? C.deepGreen : C.white, fontSize: 12, fontWeight: 600,
            }}>
              {view === "dashboard" ? "💬 Chat" : "📊 Tableau"}
            </button>
          )}
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {MODULES.map(m => (
            <button key={m.id} onClick={() => { setActiveModule(m.id); setView("chat"); }} style={{
              flex: 1, border: "none", cursor: "pointer", padding: "8px 3px",
              borderRadius: "9px 9px 0 0",
              background: activeModule === m.id ? C.off : "rgba(255,255,255,.07)",
              color: activeModule === m.id ? m.color : "rgba(255,255,255,.6)",
              fontSize: 11, fontWeight: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, transition: "all .2s",
            }}>
              <span style={{ fontSize: 15 }}>{m.icon}</span><span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MODULE BAR */}
      <div style={{ background: mod.bg, borderBottom: `2px solid ${mod.color}20`, padding: "7px 18px", fontSize: 12, color: mod.color, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: mod.color }} />
        <strong>{mod.label}</strong>
        {activeModule === "finance" && expenses.length > 0 && (
          <span style={{ marginLeft: "auto", fontWeight: 700 }}>
            {expenses.reduce((s, e) => s + e.montant, 0).toLocaleString("fr-FR")} FCFA
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* VUE MARCHÉ */}
        {activeModule === "marche" && (
          <div style={{ flex: 1, overflow: "auto", paddingTop: 16 }}><MarcheView /></div>
        )}

        {/* VUE QR */}
        {activeModule === "qr" && (
          <div style={{ flex: 1, overflow: "auto", paddingTop: 16 }}><QRView /></div>
        )}

        {/* VUE CHAT (agro + finance) */}
        {!isSpecialView && (
          <>
            {/* DASHBOARD FINANCES */}
            {activeModule === "finance" && view === "dashboard" ? (
              <div style={{ flex: 1, overflow: "auto", paddingTop: 16 }}><Dashboard expenses={expenses} /></div>
            ) : (
              <>
                {/* MESSAGES */}
                <div style={{ flex: 1, overflow: "auto", padding: "14px 14px 0" }}>
                  {messages.map((msg, i) => (
                    <div key={i} className="msg" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                      {msg.role === "assistant" && (
                        <div style={{ width: 30, height: 30, borderRadius: 9, background: C.deepGreen, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 7, marginTop: 2 }}>🌾</div>
                      )}
                      <div style={{ maxWidth: "78%" }}>
                        <div style={{
                          background: msg.role === "user" ? `linear-gradient(135deg,${C.deepGreen},${C.midGreen})` : C.white,
                          color: msg.role === "user" ? C.white : C.dark,
                          borderRadius: msg.role === "user" ? "17px 17px 4px 17px" : "4px 17px 17px 17px",
                          padding: "10px 13px", fontSize: 14, lineHeight: 1.55,
                          boxShadow: "0 2px 8px rgba(0,0,0,.06)",
                        }} dangerouslySetInnerHTML={{ __html: renderMD(msg.clean || msg.content) }} />
                        {msg.expense && <ExpenseTag exp={msg.expense} />}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 9, background: C.deepGreen, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🌾</div>
                      <div style={{ background: C.white, borderRadius: "4px 17px 17px 17px", padding: "11px 15px", display: "flex", gap: 5, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                        {[0, 1, 2].map(j => <div key={j} className="dot" style={{ width: 7, height: 7, borderRadius: "50%", background: C.leaf, animationDelay: `${j * .2}s` }} />)}
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* SUGGESTIONS */}
                <div style={{ padding: "8px 14px 0", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
                  {SUGGESTIONS[activeModule].map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)} style={{
                      flexShrink: 0, background: mod.bg, border: `1px solid ${mod.color}30`,
                      borderRadius: 20, padding: "5px 12px", fontSize: 11.5,
                      color: mod.color, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                    }}>{s}</button>
                  ))}
                </div>

                {/* INPUT */}
                <div style={{ padding: 14, background: C.white, borderTop: `1px solid ${C.off}`, display: "flex", gap: 9, alignItems: "flex-end" }}>
                  <textarea value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={`Question — ${mod.label}...`} rows={1}
                    style={{ flex: 1, border: `1.5px solid ${C.off}`, borderRadius: 13, padding: "9px 13px", fontSize: 14, fontFamily: "inherit", resize: "none", background: C.off, color: C.dark, lineHeight: 1.4, maxHeight: 90, overflowY: "auto" }}
                    onFocus={e => e.target.style.borderColor = mod.color}
                    onBlur={e => e.target.style.borderColor = C.off}
                  />
                  <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
                    width: 42, height: 42, borderRadius: 13, border: "none",
                    background: input.trim() && !loading ? `linear-gradient(135deg,${C.deepGreen},${C.midGreen})` : C.off,
                    color: input.trim() && !loading ? C.white : C.light,
                    cursor: input.trim() && !loading ? "pointer" : "default",
                    fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s",
                  }}>↑</button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ background: C.deepGreen, padding: "5px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", letterSpacing: .5 }}>Agriboss Academy · Big Village Farm</div>
        <div style={{ fontSize: 10, color: C.fresh, fontWeight: 500 }}>🌍 Lomé, Togo — Mai 2026</div>
      </div>
    </div>
  );
}
