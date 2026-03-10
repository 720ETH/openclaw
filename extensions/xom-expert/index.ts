import { Type } from "@sinclair/typebox";
import type { AnyAgentTool, OpenClawPluginApi } from "../../src/plugins/types.js";

const XOM_SYSTEM_PROMPT = `You are an expert analyst specializing exclusively in ExxonMobil Corporation (NYSE: XOM).

## Your Expertise

**Company Overview**
ExxonMobil is one of the world's largest publicly traded oil and gas companies, headquartered in Spring, Texas. It operates across the full energy value chain through three primary business segments:

1. **Upstream** — Exploration and production of crude oil and natural gas. Key assets include the Permian Basin (Midland and Delaware sub-basins), Guyana (Stabroek block with 11+ billion barrels of discovered resource), LNG operations in Papua New Guinea and Mozambique, and deepwater Gulf of Mexico.

2. **Energy Products (Downstream)** — Refining, fuels marketing, lubricants, and supply/trading. ExxonMobil operates one of the world's largest refining networks with ~4.6 million barrels per day of capacity.

3. **Chemical Products** — Manufacture and sale of petrochemicals including olefins, polyolefins, aromatics, and specialty products. Operates through ExxonMobil Chemical Company.

4. **Specialty Products** — Lubricants (Mobil 1), basestocks, waxes, and other high-value specialty products.

**Financial Profile**
- Ticker: XOM (NYSE)
- S&P 500 component; one of the largest by market cap
- Consistent dividend payer; part of the Dividend Aristocrats (40+ consecutive years of dividend increases)
- Key metrics to track: earnings per share (EPS), free cash flow (FCF), return on capital employed (ROCE), production volumes (koebd/Moebd), realized prices, and structural cost savings
- Strong balance sheet; investment-grade credit rating (AA/Aa2)

**Strategic Priorities (ExxonMobil Plan Through 2030)**
- Grow Permian Basin production toward ~2.3 million boe/d by 2030
- Accelerate Guyana development (Payara, Yellowtail, Hammerhead FPSOs)
- Low Carbon Solutions business: carbon capture and storage (CCS), hydrogen, lithium mining (Smackover, Arkansas), and biofuels
- Pioneer acquisition (closed 2024) — added ~700,000 net acres in the Permian
- $15 billion structural cost reduction target vs. 2019 baseline
- Advantaged molecules strategy: focus on products that command premium margins

**Low Carbon / Energy Transition**
- CCS: Targeting >10 Mtpa CO2 storage capacity
- Hydrogen: Blue hydrogen projects; Gulf Coast hydrogen hub
- Lithium: Direct lithium extraction (DLE) from Smackover Formation brine; targeting 100,000 tonnes/year by 2030
- Biofuels: Carinata-based renewable diesel, SAF
- ProxximaTM advanced recycling of plastics

**Key Risks**
- Oil and gas price volatility (Brent, WTI, Henry Hub)
- Regulatory and energy transition policy risk (IRA, EU carbon border adjustments, SEC climate disclosure)
- Geopolitical risk (Guyana border dispute with Venezuela, Russia exit post-2022)
- Project execution risk (large capital projects in Guyana, LNG)
- Litigation: Hess/Chevron arbitration over Guyana ROFR (right of first refusal)
- Carbon liability and stranded asset risk

**Competitive Landscape**
- Peers: Chevron (CVX), Shell (SHEL), BP (BP), TotalEnergies (TTE), ConocoPhillips (COP)
- Differentiator: Integrated model, chemicals scale, proprietary technology (EMRE), advantaged cost structure

**Key People (as of early 2026)**
- Darren Woods — Chairman and CEO
- Kathryn Mikells — Senior VP and CFO

## How You Respond

- Provide precise, well-sourced analysis grounded in publicly available ExxonMobil filings (10-K, 10-Q, proxy, earnings transcripts), investor presentations, and reputable financial data
- When asked about current prices or recent news, note that your knowledge has a cutoff and recommend checking Bloomberg, Reuters, or ExxonMobil's investor relations page (ir.exxonmobil.com) for live data
- Structure responses clearly: lead with a direct answer, then provide supporting detail
- Use energy industry terminology correctly (boe/d, koebd, ROCE, upstream/downstream, netback, crack spread, Henry Hub, LNG, etc.)
- When comparing to peers, be balanced and data-driven
- Flag uncertainty clearly; do not fabricate specific figures`;

const xomLookupTool = {
  name: "xom_lookup",
  label: "XOM Data Lookup",
  description:
    "Look up key ExxonMobil (XOM) reference data: business segments, financial metrics definitions, key assets, or strategic initiatives. Use this to ground responses in structured XOM knowledge.",
  parameters: Type.Object({
    topic: Type.String({
      description:
        'Topic to look up. Examples: "segments", "guyana", "permian", "dividends", "low-carbon", "financials", "competitors", "management".',
    }),
  }),
  // oxlint-disable-next-line typescript/require-await
  async execute(_id: string, params: Record<string, unknown>) {
    const topic = typeof params.topic === "string" ? params.topic.toLowerCase().trim() : "";

    const data: Record<string, string> = {
      segments: `ExxonMobil operates four segments:
1. Upstream — E&P; key assets: Permian Basin, Guyana Stabroek, PNG LNG, Mozambique LNG, deepwater GoM
2. Energy Products — Refining & fuels marketing; ~4.6 Mbd capacity
3. Chemical Products — Olefins, polyolefins, aromatics via ExxonMobil Chemical
4. Specialty Products — Mobil 1 lubricants, basestocks, waxes`,

      guyana: `Stabroek Block (45% WI, operator): 11+ billion barrels discovered resource.
FPSOs: Liza Destiny (~120 kbd), Liza Unity (~220 kbd), Payara (~220 kbd), Yellowtail (~250 kbd, FID 2022, online ~2025), Hammerhead (next). Partners: Hess (30%), CNOOC (25%). Note: Chevron/Hess merger triggered arbitration over XOM's ROFR on the Hess stake.`,

      permian: `Permian Basin: ~570,000+ net acres (Midland + Delaware). Production target ~2.3 Moebd by 2030. Pioneer acquisition (closed Oct 2024) added ~700,000 net acres and significant production. Largest Permian operator by acreage post-Pioneer.`,

      dividends: `XOM is a Dividend Aristocrat with 40+ years of consecutive dividend increases. Quarterly dividend raised to $0.99/share in 2024. Supplemented by share buyback program (up to $20B/year). Dividend yield typically 3–4%.`,

      "low-carbon": `Low Carbon Solutions segment:
- CCS: >10 Mtpa CO2 storage target; Bayou Bend hub (GoM)
- Hydrogen: Blue H2 projects; Gulf Coast Hydrogen Hub
- Lithium: DLE from Smackover brine (Arkansas); 100,000 t/y by 2030 target
- Biofuels: Carinata-based renewable diesel, SAF
- Proxxima™: advanced plastic recycling technology`,

      financials: `Key XOM financial metrics:
- ROCE (Return on Capital Employed): target best-in-class vs. majors
- Free Cash Flow (FCF): used for dividends, buybacks, and debt reduction
- Structural cost savings: $15B target vs. 2019 baseline
- Earnings sensitivity: ~$1/bbl Brent = ~$500M–$600M annual earnings impact
- Segments reported quarterly in 10-Q; annual 10-K filed Feb/March`,

      competitors: `Primary peers:
- Chevron (CVX) — direct US-listed peer; competing for Hess Guyana stake
- Shell (SHEL) — global integrated; strong LNG and chemicals
- BP (BP) — transitioning strategy; reduced upstream ambition
- TotalEnergies (TTE) — aggressive LNG and renewables integration
- ConocoPhillips (COP) — pure-play upstream; acquired Marathon Oil (2024)`,

      management: `Key executives (early 2026):
- Darren Woods — Chairman & CEO (since 2017)
- Kathryn Mikells — Senior VP & CFO
- Neil Chapman — Senior VP (chemicals, downstream, trading)
ExxonMobil board includes independent directors with energy, finance, and technology backgrounds.`,
    };

    const match =
      Object.entries(data).find(([key]) => topic.includes(key)) ??
      Object.entries(data).find(([key]) => key.includes(topic));

    const text = match
      ? match[1]
      : `Available XOM topics: ${Object.keys(data).join(", ")}. Please refine your query to one of these topics.`;

    return {
      content: [{ type: "text", text }],
      details: { topic },
    };
  },
} satisfies AnyAgentTool;

const xomExpertPlugin = {
  id: "xom-expert",
  name: "XOM Expert",
  description:
    "ExxonMobil (XOM) expert agent — deep knowledge of ExxonMobil's business, financials, strategy, and operations.",

  register(api: OpenClawPluginApi) {
    // Inject the XOM expert system prompt before every agent run
    api.on("before_prompt_build", () => {
      return {
        systemPrompt: XOM_SYSTEM_PROMPT,
      };
    });

    // Register the structured XOM lookup tool
    api.registerTool(xomLookupTool as unknown as AnyAgentTool, { optional: true });
  },
};

export default xomExpertPlugin;
