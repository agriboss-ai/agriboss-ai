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
  purple: "#6B35A8", purplePale: "#F3E8FF",
};

/* ─────────────────────────────────────────────
   PAIEMENT MOBILE MONEY
───────────────────────────────────────────── */
const PAYMENT = {
  flooz: { numero: "+22896500099", nom: "Flooz (Moov)", emoji: "📱" },
  mixby: { numero: "+22870503036", nom: "Mixby Yass (T-Money)", emoji: "💳" },
};

/* ─────────────────────────────────────────────
   NIVEAUX DE RAPPORT
───────────────────────────────────────────── */
const RAPPORT_TIERS = [
  {
    id: "hebdo",
    nom: "Rapport Hebdomadaire",
    prix: 0,
    label: "GRATUIT",
    color: C.fresh,
    bg: C.pale,
    emoji: "📅",
    description: "Résumé de la semaine — dépenses et observations",
    features: ["Résumé 7 jours", "Totaux par catégorie", "Téléchargement PDF"],
    livraison: ["download"],
  },
  {
    id: "simple",
    nom: "Rapport Mensuel Simple",
    prix: 0,
    label: "GRATUIT",
    color: C.leaf,
    bg: C.pale,
    emoji: "📄",
    description: "Total par catégorie + graphique visuel",
    features: ["Totaux par catégorie", "Graphique dépenses", "Téléchargement PDF"],
    livraison: ["download"],
  },
  {
    id: "complet",
    nom: "Rapport Complet",
    prix: 500,
    label: "500 FCFA",
    color: C.sky,
    bg: C.skyPale,
    emoji: "📊",
    description: "Détail complet + analyse + conseils financiers",
    features: ["Tout du Simple", "Détail chaque dépense", "Analyse financière", "Conseils IA", "WhatsApp + PDF"],
    livraison: ["download", "whatsapp"],
  },
  {
    id: "pro",
    nom: "Rapport Professionnel",
    prix: 1000,
    label: "1 000 FCFA",
    color: C.purple,
    bg: C.purplePale,
    emoji: "🏆",
    description: "Bilan comptable + rentabilité + recommandations stratégiques",
    features: ["Tout du Complet", "Bilan comptable", "Seuil de rentabilité", "Plan d'action", "WhatsApp + Email + PDF"],
    livraison: ["download", "whatsapp", "email"],
  },
];

/* ─────────────────────────────────────────────
   BASE DE DONNÉES CULTURES
───────────────────────────────────────────── */
const CULTURES = {
  tomate: { nom: "Tomate", emoji: "🍅", saison: "Oct–Jan / Avr–Jun", regions: ["Maritime", "Plateaux", "Centrale"], rendement: "15–25 t/ha", cycle: "90–120 jours", intrants_ha: { semences: 8000, engrais: 45000, pesticides: 30000, maindoeuvre: 60000, total: 143000 }, prix_moyen: { min: 100, max: 350, unite: "FCFA/kg" }, maladies: ["Mildiou", "Alternariose", "Fusariose", "Virus de la tomate"], conseils: "Arrosage régulier sans excès. Tuteurer dès 20cm. Traitement préventif anti-mildiou toutes les 2 semaines." },
  mais: { nom: "Maïs", emoji: "🌽", saison: "Avr–Jul / Sep–Nov", regions: ["Toutes régions"], rendement: "2–4 t/ha", cycle: "90–110 jours", intrants_ha: { semences: 12000, engrais: 38000, pesticides: 15000, maindoeuvre: 45000, total: 110000 }, prix_moyen: { min: 150, max: 280, unite: "FCFA/kg" }, maladies: ["Chenille légionnaire", "Charbon du maïs", "Rouille", "Helminthosporiose"], conseils: "Écartement 75×25cm. Apport NPK au semis, urée à 45 jours. Surveiller chenille légionnaire dès la levée." },
  igname: { nom: "Igname", emoji: "🥔", saison: "Fév–Mar (semis)", regions: ["Centrale", "Kara", "Savanes"], rendement: "10–20 t/ha", cycle: "240–300 jours", intrants_ha: { semences: 120000, engrais: 30000, pesticides: 12000, maindoeuvre: 80000, total: 242000 }, prix_moyen: { min: 200, max: 600, unite: "FCFA/kg" }, maladies: ["Anthracnose", "Nématodes", "Viroses", "Pourriture sèche"], conseils: "Utiliser des semenceaux sains de 300–400g. Butter régulièrement. L'igname est très sensible à l'excès d'eau." },
  manioc: { nom: "Manioc", emoji: "🌿", saison: "Toute l'année", regions: ["Maritime", "Plateaux", "Centrale"], rendement: "8–15 t/ha", cycle: "9–18 mois", intrants_ha: { semences: 25000, engrais: 20000, pesticides: 8000, maindoeuvre: 50000, total: 103000 }, prix_moyen: { min: 80, max: 180, unite: "FCFA/kg" }, maladies: ["Mosaïque africaine", "Cochenille farineuse", "Bactériose", "Acarien vert"], conseils: "Planter des boutures de 25–30cm. Variétés résistantes à la mosaïque recommandées. Désherbage dans les 3 premiers mois." },
  soja: { nom: "Soja", emoji: "🫘", saison: "Jun–Sep", regions: ["Centrale", "Kara", "Plateaux"], rendement: "1–2 t/ha", cycle: "90–120 jours", intrants_ha: { semences: 18000, engrais: 15000, pesticides: 10000, maindoeuvre: 35000, total: 78000 }, prix_moyen: { min: 350, max: 550, unite: "FCFA/kg" }, maladies: ["Mildiou du soja", "Sclérotiniose", "Pucerons", "Mouche du semis"], conseils: "Inoculation des semences avec rhizobium recommandée. Bonne fixation d'azote = moins d'engrais. Récolter dès que 95% des gousses sont sèches." },
  piment: { nom: "Piment", emoji: "🌶️", saison: "Toute l'année (irrigué)", regions: ["Maritime", "Plateaux"], rendement: "8–15 t/ha", cycle: "90–150 jours", intrants_ha: { semences: 15000, engrais: 40000, pesticides: 25000, maindoeuvre: 55000, total: 135000 }, prix_moyen: { min: 500, max: 1200, unite: "FCFA/kg" }, maladies: ["Anthracnose", "Phytophthora", "Thrips", "Virus du piment"], conseils: "Pépinière 4–6 semaines avant repiquage. Irrigation goutte-à-goutte idéale. Marché à forte valeur ajoutée." },
};

const MARCHE = {
  lome: { nom: "Marché de Lomé", region: "Maritime", emoji: "🏙️", prix: { tomate: { val: 250, unite: "/kg", tendance: "↑", note: "Haute saison" }, mais: { val: 200, unite: "/kg", tendance: "→", note: "Prix stable" }, igname: { val: 400, unite: "/kg", tendance: "↑", note: "Forte demande" }, manioc: { val: 120, unite: "/kg", tendance: "→", note: "Abondant" }, soja: { val: 450, unite: "/kg", tendance: "↑", note: "Demande export" }, piment: { val: 800, unite: "/kg", tendance: "↑", note: "Pénurie locale" } } },
  sokode: { nom: "Marché de Sokodé", region: "Centrale", emoji: "🌄", prix: { tomate: { val: 180, unite: "/kg", tendance: "→", note: "Bonne offre" }, mais: { val: 170, unite: "/kg", tendance: "↓", note: "Post-récolte" }, igname: { val: 320, unite: "/kg", tendance: "→", note: "Saison normale" }, manioc: { val: 90, unite: "/kg", tendance: "→", note: "Prix bas" }, soja: { val: 400, unite: "/kg", tendance: "↑", note: "Collecteurs actifs" }, piment: { val: 650, unite: "/kg", tendance: "→", note: "Marché régional" } } },
  kara: { nom: "Marché de Kara", region: "Kara", emoji: "⛰️", prix: { tomate: { val: 200, unite: "/kg", tendance: "↑", note: "Demande urbaine" }, mais: { val: 185, unite: "/kg", tendance: "→", note: "Stock moyen" }, igname: { val: 280, unite: "/kg", tendance: "↑", note: "Zone productrice" }, manioc: { val: 100, unite: "/kg", tendance: "→", note: "Stable" }, soja: { val: 420, unite: "/kg", tendance: "↑", note: "Bonne demande" }, piment: { val: 700, unite: "/kg", tendance: "↑", note: "Pénurie" } } },
  aneho: { nom: "Marché d'Anéhо", region: "Maritime", emoji: "🌊", prix: { tomate: { val: 230, unite: "/kg", tendance: "→", note: "Prix côtier" }, mais: { val: 210, unite: "/kg", tendance: "→", note: "Stable" }, igname: { val: 450, unite: "/kg", tendance: "↑", note: "Exportation" }, manioc: { val: 130, unite: "/kg", tendance: "→", note: "Normal" }, soja: { val: 480, unite: "/kg", tendance: "↑", note: "Export Bénin" }, piment: { val: 900, unite: "/kg", tendance: "↑", note: "Très demandé" } } },
};

/* ─────────────────────────────────────────────
   SYSTEM PROMPT
───────────────────────────────────────────── */
const SYSTEM_PROMPT = `Tu es Agriboss AI, l'assistant agricole intelligent d'Agriboss Academy (Big Village Farm, Togo).

## BASE DE DONNÉES CULTURES TOGOLAISES
${Object.entries(CULTURES).map(([key, c]) => `### ${c.nom} ${c.emoji}\n- Saison : ${c.saison}\n- Rendement : ${c.rendement}\n- Budget/ha : ${c.intrants_ha.total.toLocaleString("fr-FR")} FCFA\n- Prix : ${c.prix_moyen.min}–${c.prix_moyen.max} ${c.prix_moyen.unite}\n- Maladies : ${c.maladies.join(", ")}\n- Conseil : ${c.conseils}`).join("\n\n")}

## PRIX DU MARCHÉ (Mai 2026)
${Object.entries(MARCHE).map(([key, m]) => `### ${m.nom}\n${Object.entries(m.prix).map(([culture, p]) => `- ${CULTURES[culture]?.nom || culture} : ${p.val} FCFA${p.unite} ${p.tendance} (${p.note})`).join("\n")}`).join("\n\n")}

## TES DOMAINES
1. AGRONOMIE : Diagnostic maladies, conseils cultures, calendriers.
2. GESTION FINANCIÈRE : Quand l'agriculteur mentionne une dépense, calcule le TOTAL et inclus ce bloc OBLIGATOIREMENT sur une seule ligne :
[DEPENSE: {"categorie":"intrants","description":"3 sacs engrais NPK","montant":54000,"date":"aujourd'hui"}]
Catégories : intrants, main-oeuvre, transport, équipement, location, elevage, autre
3. MARCHÉ : Prix, acheteurs, commercialisation.

## RÈGLES
- Toujours en français, simple et pratique
- Max 200 mots sauf si analyse complète demandée
- Chaleureux comme un conseiller de terrain
- Produits disponibles au Togo, prix en FCFA`;

/* ─────────────────────────────────────────────
   UTILS
───────────────────────────────────────────── */
const WA_NUMBER = "13323886586";
const WA_MESSAGE = encodeURIComponent(`Bonjour Agriboss AI 🌾\n\nJe suis agriculteur au Togo et je veux utiliser votre assistant intelligent.\n\nMon nom : \nMa région : \nMes cultures principales : \n\nJe veux de l'aide sur : [ ] Agronomie  [ ] Finances  [ ] Prix du marché`);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

function parseExpense(text) {
  const m1 = text.match(/\[DEPENSE:\s*(\{[\s\S]*?\})\]/);
  if (m1) { try { return JSON.parse(m1[1]); } catch {} }
  const m2 = text.match(/DEPENSE:\s*(\{[\s\S]*?\})/);
  if (m2) { try { return JSON.parse(m2[1]); } catch {} }
  return null;
}
function cleanMsg(text) {
  return text.replace(/\[DEPENSE:\s*\{[\s\S]*?\}\]/g, "").replace(/DEPENSE:\s*\{[\s\S]*?\}/g, "").trim();
}
function renderMD(text) {
  return text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\n/g, "<br/>");
}
function getMois() {
  return new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

/* ─────────────────────────────────────────────
   COMPOSANT — CARTE DÉPENSE
───────────────────────────────────────────── */
function ExpenseTag({ exp }) {
  const icons = { intrants: "🌿", "main-oeuvre": "👷", transport: "🚛", équipement: "⚙️", location: "🏡", elevage: "🐄", autre: "📦" };
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

/* ─────────────────────────────────────────────
   COMPOSANT — MODAL PAIEMENT
───────────────────────────────────────────── */
function PaymentModal({ tier, onClose, onPaid }) {
  const [step, setStep] = useState("choose"); // choose | confirm
  const [method, setMethod] = useState(null);

  if (tier.prix === 0) { onPaid(); return null; }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.white, borderRadius: 20, padding: 24, maxWidth: 360, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.deepGreen, marginBottom: 4 }}>
          Paiement {tier.emoji} {tier.nom}
        </div>
        <div style={{ fontSize: 13, color: C.light, marginBottom: 20 }}>Montant : <strong style={{ color: C.earth }}>{tier.prix.toLocaleString("fr-FR")} FCFA</strong></div>

        {step === "choose" && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.mid, marginBottom: 12 }}>Choisissez votre moyen de paiement :</div>
            {Object.entries(PAYMENT).map(([key, p]) => (
              <button key={key} onClick={() => { setMethod(p); setStep("confirm"); }} style={{
                width: "100%", border: `2px solid ${C.off}`, borderRadius: 12, padding: "12px 16px",
                background: C.white, cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                marginBottom: 10, textAlign: "left", transition: "all 0.2s",
              }}
                onMouseOver={e => e.currentTarget.style.borderColor = C.deepGreen}
                onMouseOut={e => e.currentTarget.style.borderColor = C.off}
              >
                <span style={{ fontSize: 24 }}>{p.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.dark }}>{p.nom}</div>
                  <div style={{ fontSize: 12, color: C.light }}>{p.numero}</div>
                </div>
              </button>
            ))}
          </>
        )}

        {step === "confirm" && method && (
          <>
            <div style={{ background: C.pale, borderRadius: 14, padding: "16px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.deepGreen, marginBottom: 8 }}>📋 Instructions de paiement</div>
              <div style={{ fontSize: 13, color: C.dark, lineHeight: 1.7 }}>
                1. Ouvrez <strong>{method.nom}</strong> sur votre téléphone<br />
                2. Envoyez <strong style={{ color: C.earth }}>{tier.prix.toLocaleString("fr-FR")} FCFA</strong> au numéro :<br />
                <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: C.deepGreen, textAlign: "center", margin: "10px 0", background: C.white, borderRadius: 8, padding: "8px" }}>
                  {method.numero}
                </div>
                3. Notez le <strong>code de transaction</strong><br />
                4. Cliquez "J'ai payé" ci-dessous
              </div>
            </div>
            <button onClick={onPaid} style={{
              width: "100%", background: `linear-gradient(135deg,${C.deepGreen},${C.midGreen})`,
              color: C.white, border: "none", borderRadius: 12, padding: "14px",
              fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 10,
            }}>
              ✅ J'ai payé — Générer mon rapport
            </button>
            <button onClick={() => setStep("choose")} style={{
              width: "100%", background: "transparent", color: C.light,
              border: `1px solid ${C.off}`, borderRadius: 12, padding: "10px",
              cursor: "pointer", fontSize: 13,
            }}>← Changer de méthode</button>
          </>
        )}

        <button onClick={onClose} style={{ width: "100%", background: "transparent", color: C.light, border: "none", padding: "10px", cursor: "pointer", fontSize: 12, marginTop: 4 }}>
          Annuler
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPOSANT — GÉNÉRATEUR RAPPORT
───────────────────────────────────────────── */
function RapportGenerator({ expenses, onClose }) {
  const [selectedTier, setSelectedTier] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [rapport, setRapport] = useState(null);
  const [email, setEmail] = useState("");

  const total = expenses.reduce((s, e) => s + e.montant, 0);
  const byCat = expenses.reduce((a, e) => { a[e.categorie] = (a[e.categorie] || 0) + e.montant; return a; }, {});

  async function generateRapport(tier) {
    setGenerating(true);
    try {
      const GROQ_KEY = process.env.REACT_APP_GROQ_KEY || "";
      const prompt = `Tu es un expert-comptable agricole au Togo. Génère un rapport financier ${tier.nom} pour un agriculteur.

Données du mois (${getMois()}) :
- Total dépenses : ${total.toLocaleString("fr-FR")} FCFA
- Détail par catégorie : ${Object.entries(byCat).map(([cat, amt]) => `${cat}: ${amt.toLocaleString("fr-FR")} FCFA`).join(", ")}
- Nombre de transactions : ${expenses.length}
- Détail transactions : ${expenses.map(e => `${e.description} (${e.categorie}): ${e.montant.toLocaleString("fr-FR")} FCFA`).join("; ")}

${tier.id === "hebdo" ? "Génère un résumé HEBDOMADAIRE simple et clair avec : totaux de la semaine par catégorie, 2 observations clés, et 1 conseil pour la semaine prochaine." : ""}
${tier.id === "simple" ? "Génère un résumé mensuel simple avec totaux par catégorie et 2-3 observations." : ""}
${tier.id === "complet" ? "Génère une analyse mensuelle complète avec : résumé exécutif, analyse par catégorie, ratio intrants/main-d'oeuvre, 3 conseils financiers concrets pour optimiser les coûts, comparaison avec budget type par culture." : ""}
${tier.id === "pro" ? "Génère un bilan mensuel comptable professionnel complet avec : résumé exécutif, analyse détaillée par poste, calcul du seuil de rentabilité estimé, ROI projeté, 5 recommandations stratégiques, plan d'action pour le mois suivant, et indicateurs clés de performance agricole." : ""}

Réponds en français, de façon structurée avec des sections claires. Utilise des emojis pour rendre le rapport lisible.`;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setRapport(data.choices?.[0]?.message?.content || "Erreur de génération.");
    } catch { setRapport("Erreur de connexion. Veuillez réessayer."); }
    setGenerating(false);
  }

  function downloadPDF() {
    const content = `AGRIBOSS AI — ${selectedTier.nom}\n${getMois()}\n${"=".repeat(50)}\n\n${rapport}\n\n${"=".repeat(50)}\nGénéré par Agriboss AI — agriboss-ai.vercel.app\nBig Village Farm — Lomé, Togo`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Rapport_AgribossAI_${getMois().replace(" ", "_")}.txt`;
    a.click();
  }

  function shareWhatsApp() {
    const msg = encodeURIComponent(`🌾 *Rapport Agriboss AI — ${getMois()}*\n\n${rapport?.substring(0, 500)}...\n\n📊 Généré par agriboss-ai.vercel.app`);
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  if (rapport) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.white, borderRadius: 20, padding: 20, maxWidth: 480, width: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.deepGreen }}>
            {selectedTier.emoji} {selectedTier.nom}
          </div>
          <div style={{ fontSize: 11, color: C.light }}>{getMois()}</div>
        </div>

        <div style={{ background: C.pale, borderRadius: 12, padding: "14px", marginBottom: 16, fontSize: 13, lineHeight: 1.7, color: C.dark, whiteSpace: "pre-wrap" }}>
          {rapport}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={downloadPDF} style={{ background: `linear-gradient(135deg,${C.deepGreen},${C.midGreen})`, color: C.white, border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            📥 Télécharger le rapport
          </button>
          {selectedTier.livraison.includes("whatsapp") && (
            <button onClick={shareWhatsApp} style={{ background: "#25D366", color: C.white, border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              📲 Partager sur WhatsApp
            </button>
          )}
          {selectedTier.livraison.includes("email") && (
            <div style={{ display: "flex", gap: 8 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={{ flex: 1, border: `1.5px solid ${C.off}`, borderRadius: 10, padding: "10px 12px", fontSize: 13, fontFamily: "inherit" }} />
              <button style={{ background: C.sky, color: C.white, border: "none", borderRadius: 10, padding: "10px 14px", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>📧 Email</button>
            </div>
          )}
          <button onClick={onClose} style={{ background: "transparent", color: C.light, border: `1px solid ${C.off}`, borderRadius: 12, padding: "10px", cursor: "pointer", fontSize: 13 }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.white, borderRadius: 20, padding: 20, maxWidth: 480, width: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: C.deepGreen, marginBottom: 4 }}>
          📋 Rapport Mensuel
        </div>
        <div style={{ fontSize: 13, color: C.light, marginBottom: 6 }}>{getMois()} · {expenses.length} transactions · {total.toLocaleString("fr-FR")} FCFA</div>

        {expenses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: C.light }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
            Aucune dépense enregistrée ce mois. Commencez par saisir vos dépenses dans l'onglet Finances.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.mid, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
              Choisissez votre type de rapport
            </div>

            {generating ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>⏳</div>
                <div style={{ fontWeight: 600, color: C.deepGreen }}>Génération en cours...</div>
                <div style={{ fontSize: 13, color: C.light, marginTop: 6 }}>L'IA analyse vos données financières</div>
              </div>
            ) : (
              <>
                {RAPPORT_TIERS.map(tier => (
                  <div key={tier.id} onClick={() => setSelectedTier(tier)} style={{
                    border: `2px solid ${selectedTier?.id === tier.id ? tier.color : C.off}`,
                    borderRadius: 14, padding: "14px", marginBottom: 10, cursor: "pointer",
                    background: selectedTier?.id === tier.id ? tier.bg : C.white,
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>{tier.emoji}</span>
                        <div style={{ fontWeight: 700, fontSize: 14, color: C.dark }}>{tier.nom}</div>
                      </div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: tier.color }}>
                        {tier.label}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: C.light, marginBottom: 8 }}>{tier.description}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {tier.features.map(f => (
                        <span key={f} style={{ fontSize: 10, background: tier.bg, color: tier.color, borderRadius: 20, padding: "2px 8px", fontWeight: 500 }}>✓ {f}</span>
                      ))}
                    </div>
                  </div>
                ))}

                {selectedTier && (
                  <button onClick={() => {
                    if (selectedTier.prix === 0) { generateRapport(selectedTier); }
                    else { setShowPayment(true); }
                  }} style={{
                    width: "100%", background: `linear-gradient(135deg,${selectedTier.color},${C.deepGreen})`,
                    color: C.white, border: "none", borderRadius: 12, padding: "14px",
                    fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 4,
                  }}>
                    {selectedTier.prix === 0 ? "📄 Générer gratuitement" : `💳 Payer ${selectedTier.prix.toLocaleString("fr-FR")} FCFA et générer`}
                  </button>
                )}
              </>
            )}
          </>
        )}

        <button onClick={onClose} style={{ width: "100%", background: "transparent", color: C.light, border: "none", padding: "12px", cursor: "pointer", fontSize: 13, marginTop: 8 }}>
          Annuler
        </button>
      </div>

      {showPayment && selectedTier && (
        <PaymentModal
          tier={selectedTier}
          onClose={() => setShowPayment(false)}
          onPaid={() => { setShowPayment(false); generateRapport(selectedTier); }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPOSANT — DASHBOARD
───────────────────────────────────────────── */
function Dashboard({ expenses, onRapport }) {
  const total = expenses.reduce((s, e) => s + e.montant, 0);
  const byCat = expenses.reduce((a, e) => { a[e.categorie] = (a[e.categorie] || 0) + e.montant; return a; }, {});

  if (!expenses.length) return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ textAlign: "center", padding: "40px 20px", background: C.pale, borderRadius: 16, border: `2px dashed ${C.fresh}` }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>💰</div>
        <div style={{ fontWeight: 600, color: C.deepGreen, marginBottom: 6 }}>Aucune dépense enregistrée</div>
        <div style={{ fontSize: 13, color: C.light }}>Dites à Agriboss AI ce que vous avez acheté.</div>
        <div style={{ fontSize: 12, color: C.leaf, marginTop: 8, fontStyle: "italic" }}>"J'ai acheté 2 sacs d'engrais à 15 000 FCFA"</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "0 16px", overflow: "auto", flex: 1 }}>
      <div style={{ background: `linear-gradient(135deg,${C.deepGreen},${C.midGreen})`, borderRadius: 16, padding: "18px 20px", color: C.white, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", opacity: 0.65, marginBottom: 2 }}>Total dépenses — {getMois()}</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, marginBottom: 14 }}>
          {total.toLocaleString("fr-FR")} <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.75 }}>FCFA</span>
        </div>
        {Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
          const pct = Math.round((amt / total) * 100);
          return (
            <div key={cat} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                <span style={{ opacity: 0.8, textTransform: "capitalize" }}>{cat}</span>
                <span style={{ fontWeight: 600 }}>{amt.toLocaleString("fr-FR")} FCFA ({pct}%)</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 4, height: 5 }}>
                <div style={{ background: C.fresh, borderRadius: 4, height: 5, width: `${pct}%`, transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => onRapport("hebdo")} style={{
          flex: 1, background: `linear-gradient(135deg,${C.leaf},${C.midGreen})`,
          color: C.white, border: "none", borderRadius: 14, padding: "13px 8px",
          fontWeight: 700, fontSize: 12, cursor: "pointer",
        }}>
          📅 Rapport<br/>Semaine
        </button>
        <button onClick={() => onRapport("mensuel")} style={{
          flex: 2, background: `linear-gradient(135deg,${C.earth},${C.earthMid})`,
          color: C.white, border: "none", borderRadius: 14, padding: "13px",
          fontWeight: 700, fontSize: 13, cursor: "pointer",
          boxShadow: "0 4px 14px rgba(139,69,19,0.3)",
        }}>
          📋 Rapport Mensuel
        </button>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: C.mid, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
        {expenses.length} transaction{expenses.length > 1 ? "s" : ""}
      </div>
      {expenses.map((e, i) => (
        <div key={i} style={{ background: C.white, border: `1px solid ${C.off}`, borderRadius: 10, padding: "10px 13px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>{{ intrants: "🌿", "main-oeuvre": "👷", transport: "🚛", équipement: "⚙️", location: "🏡", elevage: "🐄", autre: "📦" }[e.categorie] || "📦"}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.dark }}>{e.description}</div>
              <div style={{ fontSize: 11, color: C.light, textTransform: "capitalize" }}>{e.categorie}</div>
            </div>
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 14, color: C.earth }}>
            {e.montant.toLocaleString("fr-FR")} <span style={{ fontSize: 10 }}>FCFA</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPOSANT — MARCHÉ
───────────────────────────────────────────── */
function MarcheView() {
  const [selected, setSelected] = useState("lome");
  const m = MARCHE[selected];
  const tendColors = { "↑": "#16A34A", "→": C.light, "↓": "#DC2626" };
  return (
    <div style={{ padding: "0 16px", overflow: "auto", flex: 1 }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.deepGreen, marginBottom: 4 }}>Prix du Marché</div>
      <div style={{ fontSize: 12, color: C.light, marginBottom: 14 }}>Mai 2026</div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", marginBottom: 16, paddingBottom: 4 }}>
        {Object.entries(MARCHE).map(([key, mk]) => (
          <button key={key} onClick={() => setSelected(key)} style={{ flexShrink: 0, border: "none", cursor: "pointer", borderRadius: 20, padding: "7px 14px", background: selected === key ? C.deepGreen : C.pale, color: selected === key ? C.white : C.deepGreen, fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>
            {mk.emoji} {mk.nom.replace("Marché de ", "").replace("Marché d'", "")}
          </button>
        ))}
      </div>
      <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20 }}>
        <div style={{ background: `linear-gradient(135deg,${C.deepGreen},${C.midGreen})`, padding: "12px 16px" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: C.white, fontSize: 16 }}>{m.nom}</div>
          <div style={{ fontSize: 11, color: C.fresh }}>{m.region}</div>
        </div>
        {Object.entries(m.prix).map(([culture, p], i) => (
          <div key={culture} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderBottom: i < Object.keys(m.prix).length - 1 ? `1px solid ${C.off}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{CULTURES[culture]?.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.dark }}>{CULTURES[culture]?.nom || culture}</div>
                <div style={{ fontSize: 11, color: C.light }}>{p.note}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 16, color: C.deepGreen }}>{p.val} <span style={{ fontSize: 11, fontWeight: 400 }}>FCFA{p.unite}</span></div>
              <div style={{ fontSize: 13, color: tendColors[p.tendance] }}>{p.tendance}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPOSANT — QR / REJOINDRE
───────────────────────────────────────────── */
function QRView() {
  const [copied, setCopied] = useState(false);
  function copyLink() { navigator.clipboard?.writeText(WA_LINK).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(WA_LINK)}&color=1B4332&bgcolor=FAFAF8`;
  return (
    <div style={{ padding: "0 20px", overflow: "auto", flex: 1 }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.deepGreen, marginBottom: 4 }}>Rejoindre Agriboss AI</div>
      <div style={{ fontSize: 13, color: C.light, marginBottom: 20 }}>Partagez avec les agriculteurs du réseau Big Village Farm</div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ display: "inline-block", padding: 16, background: C.white, borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", border: `3px solid ${C.pale}` }}>
          <img src={qrUrl} alt="QR Code WhatsApp Agriboss AI" width={200} height={200} style={{ borderRadius: 10, display: "block" }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: C.light }}>Scanner avec l'appareil photo</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#25D366", color: C.white, borderRadius: 14, padding: "14px", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
          <span style={{ fontSize: 20 }}>📲</span> Ouvrir dans WhatsApp
        </a>
        <button onClick={copyLink} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: copied ? C.pale : C.off, color: copied ? C.deepGreen : C.mid, border: `1.5px solid ${copied ? C.leaf : C.off}`, borderRadius: 14, padding: "13px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          {copied ? "✅ Lien copié !" : "📋 Copier le lien"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODULES
───────────────────────────────────────────── */
const MODULES = [
  { id: "agro", icon: "🌱", label: "Agronomie", color: C.leaf, bg: C.pale },
  { id: "finance", icon: "💰", label: "Finances", color: C.earth, bg: C.earthPale },
  { id: "marche", icon: "📊", label: "Marché", color: C.sky, bg: C.skyPale },
  { id: "qr", icon: "📲", label: "Rejoindre", color: "#6B35A8", bg: C.purplePale },
];

const SUGGESTIONS = {
  agro: ["Mes feuilles de tomates jaunissent", "Traitement chenille légionnaire maïs", "Calendrier cultural igname — région Kara"],
  finance: ["J'ai acheté 3 sacs NPK à 18 000 FCFA", "Payé 5 ouvriers à 3 500 FCFA", "Vaccin bétail : 12 000 FCFA"],
  marche: ["Prix tomate à Lomé aujourd'hui ?", "Où vendre mon soja au meilleur prix ?", "Comparaison prix igname Kara vs Lomé"],
  qr: [],
};

/* ─────────────────────────────────────────────
   APP PRINCIPALE
───────────────────────────────────────────── */
export default function AgribossAI() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Bonjour ! Je suis **Agriboss AI** 🌾\n\nVotre conseiller agricole intelligent pour le Togo. Je connais vos cultures, les prix des marchés de Lomé, Sokodé, Kara et Anéhо, et je peux vous aider à gérer vos dépenses et générer vos rapports financiers.\n\nComment puis-je vous aider aujourd'hui ?",
    clean: "Bonjour ! Je suis **Agriboss AI** 🌾\n\nVotre conseiller agricole intelligent pour le Togo. Je connais vos cultures, les prix des marchés de Lomé, Sokodé, Kara et Anéhо, et je peux vous aider à gérer vos dépenses et générer vos rapports financiers.\n\nComment puis-je vous aider aujourd'hui ?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeModule, setActiveModule] = useState("agro");
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState("chat");
  const [showRapport, setShowRapport] = useState(false);
  const [rapportType, setRapportType] = useState("mensuel");
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
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 1000, messages: [{ role: "system", content: SYSTEM_PROMPT }, ...next.map(m => ({ role: m.role, content: m.content }))] }),
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
            <button onClick={() => setView(v => v === "chat" ? "dashboard" : "chat")} style={{ background: view === "dashboard" ? C.gold : "rgba(255,255,255,.12)", border: "none", borderRadius: 10, padding: "7px 12px", cursor: "pointer", color: view === "dashboard" ? C.deepGreen : C.white, fontSize: 12, fontWeight: 600 }}>
              {view === "dashboard" ? "💬 Chat" : "📊 Tableau"}
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {MODULES.map(m => (
            <button key={m.id} onClick={() => { setActiveModule(m.id); setView("chat"); }} style={{ flex: 1, border: "none", cursor: "pointer", padding: "8px 3px", borderRadius: "9px 9px 0 0", background: activeModule === m.id ? C.off : "rgba(255,255,255,.07)", color: activeModule === m.id ? m.color : "rgba(255,255,255,.6)", fontSize: 11, fontWeight: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, transition: "all .2s" }}>
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
          <span style={{ marginLeft: "auto", fontWeight: 700 }}>{expenses.reduce((s, e) => s + e.montant, 0).toLocaleString("fr-FR")} FCFA</span>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {activeModule === "marche" && <div style={{ flex: 1, overflow: "auto", paddingTop: 16 }}><MarcheView /></div>}
        {activeModule === "qr" && <div style={{ flex: 1, overflow: "auto", paddingTop: 16 }}><QRView /></div>}

        {!isSpecialView && (
          <>
            {activeModule === "finance" && view === "dashboard" ? (
              <div style={{ flex: 1, overflow: "auto", paddingTop: 16 }}>
                <Dashboard expenses={expenses} onRapport={(type) => { setRapportType(type || "mensuel"); setShowRapport(true); }} />
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflow: "auto", padding: "14px 14px 0" }}>
                  {messages.map((msg, i) => (
                    <div key={i} className="msg" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                      {msg.role === "assistant" && <div style={{ width: 30, height: 30, borderRadius: 9, background: C.deepGreen, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 7, marginTop: 2 }}>🌾</div>}
                      <div style={{ maxWidth: "78%" }}>
                        <div style={{ background: msg.role === "user" ? `linear-gradient(135deg,${C.deepGreen},${C.midGreen})` : C.white, color: msg.role === "user" ? C.white : C.dark, borderRadius: msg.role === "user" ? "17px 17px 4px 17px" : "4px 17px 17px 17px", padding: "10px 13px", fontSize: 14, lineHeight: 1.55, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }} dangerouslySetInnerHTML={{ __html: renderMD(msg.clean || msg.content) }} />
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

                {activeModule === "finance" && expenses.length > 0 && (
                  <div style={{ padding: "8px 14px 0", display: "flex", gap: 8 }}>
                    <button onClick={() => { setShowRapport(true); setRapportType("hebdo"); }} style={{ flex: 1, background: `linear-gradient(135deg,${C.leaf},${C.midGreen})`, color: C.white, border: "none", borderRadius: 12, padding: "11px 6px", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>
                      📅 Semaine
                    </button>
                    <button onClick={() => { setShowRapport(true); setRapportType("mensuel"); }} style={{ flex: 2, background: `linear-gradient(135deg,${C.earth},${C.earthMid})`, color: C.white, border: "none", borderRadius: 12, padding: "11px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                      📋 Rapport Mensuel
                    </button>
                  </div>
                )}

                <div style={{ padding: "8px 14px 0", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
                  {SUGGESTIONS[activeModule].map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)} style={{ flexShrink: 0, background: mod.bg, border: `1px solid ${mod.color}30`, borderRadius: 20, padding: "5px 12px", fontSize: 11.5, color: mod.color, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>{s}</button>
                  ))}
                </div>

                <div style={{ padding: 14, background: C.white, borderTop: `1px solid ${C.off}`, display: "flex", gap: 9, alignItems: "flex-end" }}>
                  <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder={`Question — ${mod.label}...`} rows={1} style={{ flex: 1, border: `1.5px solid ${C.off}`, borderRadius: 13, padding: "9px 13px", fontSize: 14, fontFamily: "inherit", resize: "none", background: C.off, color: C.dark, lineHeight: 1.4, maxHeight: 90, overflowY: "auto" }} onFocus={e => e.target.style.borderColor = mod.color} onBlur={e => e.target.style.borderColor = C.off} />
                  <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{ width: 42, height: 42, borderRadius: 13, border: "none", background: input.trim() && !loading ? `linear-gradient(135deg,${C.deepGreen},${C.midGreen})` : C.off, color: input.trim() && !loading ? C.white : C.light, cursor: input.trim() && !loading ? "pointer" : "default", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>↑</button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ background: C.deepGreen, padding: "5px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>Agriboss Academy · Big Village Farm</div>
        <div style={{ fontSize: 10, color: C.fresh, fontWeight: 500 }}>🌍 Lomé, Togo — Mai 2026</div>
      </div>

      {showRapport && <RapportGenerator expenses={expenses} onClose={() => setShowRapport(false)} />}
    </div>
  );
}
