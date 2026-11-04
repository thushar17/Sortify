// Country names as ip-api reports them where they differ from Intl's English names.
const ALIASES: Record<string, string> = {
  turkey: "TR",
  "hong kong": "HK",
  macao: "MO",
  macau: "MO",
  myanmar: "MM",
  palestine: "PS",
  "bosnia and herzegovina": "BA",
  "ivory coast": "CI",
  "republic of the congo": "CG",
  "dr congo": "CD",
};

let nameToCode: Map<string, string> | null = null;

function buildIndex() {
  const names = new Intl.DisplayNames("en", { type: "region" });
  const index = new Map(Object.entries(ALIASES));
  for (let first = 65; first <= 90; first++) {
    for (let second = 65; second <= 90; second++) {
      const code = String.fromCharCode(first, second);
      try {
        const name = names.of(code);
        if (!name || name === code) continue;
        // Legacy codes (UK, VD) canonicalize to their current ones (GB, VN).
        const canonical = Intl.getCanonicalLocales(`und-${code}`)[0].slice(4);
        if (/^[A-Z]{2}$/.test(canonical) && !index.has(name.toLowerCase())) {
          index.set(name.toLowerCase(), canonical);
        }
      } catch {
        // not a valid region code
      }
    }
  }
  return index;
}

export function getCountryFlag(country: string) {
  nameToCode ??= buildIndex();
  const code = nameToCode.get(country.toLowerCase());
  if (!code) return undefined;
  return String.fromCodePoint(...[...code].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65));
}
