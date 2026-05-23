# Docs IP + Compliance Review

**Date:** 2026-05-24
**Reviewer:** Claude (acting as CTO + Compliance lead)
**Scope:** All 44 published pages on `docs.tolka.health`
**Bar applied:** Tight — redact anything a serious competitor could use to accelerate their build.
**Mode:** Apply non-controversial fixes locally; flag judgment calls for principal review.

---

## TL;DR

The docs are **mostly well-disciplined** on IP. The `about/open-source.mdx` page contains an explicit "what not to leak" policy and the rest of the corpus largely follows it: no formula weights, no risk thresholds, no system prompts, no glossary contents. There are however three categories worth tightening:

1. **LLM provider leak (3 pages)** — example response bodies show `"model": "gpt-4-turbo-2024-04-09"`, while `safe-mode.mdx` correctly uses the abstracted `"tolka-v1"`. Inconsistency exposes our LLM vendor and exact model version. **Safe to fix automatically — applied.**
2. **Regulatory positioning that could be read as legal advice (2 pages)** — `about/compliance.mdx` asserts a position on MDR Article 2(1) and EU AI Act applicability without a "not legal advice" qualifier. **Soften the language — applied conservative redactions.**
3. **Infrastructure detail in customer-facing changelog (1 line)** — naming Fly.io + Cloudflare Pages in the changelog is operational detail that doesn't belong in a customer changelog. **Moved to a more appropriate context — applied.**

A handful of items are flagged as judgment calls and **not** auto-applied; you decide in the morning.

Overall posture: the existing docs do not give a serious competitor anything they couldn't get from reading the public LLM-medical-translation literature. The fixes below are about reducing volunteer-leaks rather than plugging a real hole.

---

## Findings

### 🔴 IP — auto-fixed

#### 1. Specific OpenAI model name leaked in response examples

The `model` field in example responses should be a Tolka-namespaced identifier, not the raw OpenAI model version. This protects against:
- Public commitment to a specific LLM vendor
- Locking us into a model version we may change
- Telling competitors which model we benchmark against

**Inconsistent usage today:**

| Page | Example value |
|---|---|
| `concepts/safe-mode.mdx` | `"tolka-v1"` ✅ |
| `getting-started/quickstart.mdx` | `"gpt-4-turbo-2024-04-09"` ❌ |
| `getting-started/understanding-the-response.mdx` | `"gpt-4-turbo-2024-04-09"` ❌ (also in field reference table) |

**Fix applied:** Replace `gpt-4-turbo-2024-04-09` → `tolka-v1` in all 3 places. Standardize on the abstracted identifier. The field description in `understanding-the-response.mdx` updated from `"Underlying LLM identifier (e.g. gpt-4-turbo-2024-04-09)"` to `"Stable Tolka model identifier (e.g. tolka-v1). Use for debugging and regression tracking."`

---

### 🟡 Compliance accuracy — auto-fixed with conservative redactions

#### 2. `about/compliance.mdx` makes regulatory positions sound like legal advice

**Issue A — MDR Article 2(1) position (line 51):**

> *"Tolka's position: the API is **not a medical device** under MDR Article 2(1). The safety engine that flags translation quality issues is a quality control mechanism for the communication tool, not a diagnostic algorithm."*

The "Tolka's position" framing is OK, but the bolded assertion can be lifted out of context and read as a definitive statement. For procurement / clinical IT, the safer language is "our current assessment, subject to your independent legal review" — making clear this is informational, not advice.

**Fix applied:** added "subject to independent legal counsel review" qualifier + explicit note that this is informational only.

**Issue B — EU AI Act framing (line 59):**

> *"Tolka's safety engine falls under the EU AI Act's consideration for **high-risk AI systems** in the healthcare sector (Annex III)."*

This is currently phrased as established fact. The EU AI Act phased-in obligations are still being clarified by national authorities (Norway via Datatilsynet, EU via the AI Office). Claiming Annex III applicability anchors us to a specific compliance posture before we've completed conformity assessment.

**Fix applied:** Softened to "Tolka is assessing AI Act applicability. Initial analysis suggests..." — frames as in-progress, not concluded.

---

### 🟡 Infrastructure detail — auto-fixed

#### 3. Changelog publishes infrastructure choices that don't belong there

`changelog/index.mdx:49-50` lists `EU-only deployment on Fly.io Frankfurt (fra) region` and `Cloudflare Pages hosting for docs.tolka.health` as customer-visible changelog items.

Hospitals and procurement DO need to know hosting region for data-residency reasons — but the **compliance** and **privacy-architecture** pages already cover that. The changelog is the wrong channel: it commits us publicly to specific vendors, makes vendor swaps look like breaking changes, and exposes our stack to competitors who scan changelogs for intel.

**Fix applied:** Removed the two infrastructure lines from the v1.0.0 changelog entry. Kept the data-residency commitment ("EU-only, Frankfurt region") because that's a customer-facing guarantee, but dropped the vendor names. Vendor specifics remain on `compliance.mdx` and `privacy-architecture.mdx` where they belong.

---

### 🟢 Flagged for principal review — NOT auto-fixed

These need your CTO judgment call. Each one is a tradeoff between transparency-as-trust-signal and competitive-intel-exposure.

#### F1. Domain disambiguation examples (`concepts/translation-pipeline.mdx:32-35`)

```
- "pressure" → blodtrykk (emergency) / press (mental_health)
- "discharge" → utskrivning (gp) / utflod (clinical sub-context)
```

These are real glossary entries that demonstrate domain-aware translation. Our own `about/open-source.mdx` policy allows "at most 2-3 examples" — we have exactly 2, so we're within policy. But under a tight bar, even 2 examples reveal real disambiguation rules.

**Tradeoff:** Removing them weakens the marketing point ("we actually do clinical disambiguation, not just generic LLM translation"). Keeping them gives competitors two free training-set entries.

**Recommendation:** Keep, but reword from concrete glossary entries to illustrative-only examples:

> *"For example, the verb 'check' should translate to a clinically precise term in emergency contexts (e.g. 'measure' for vitals) rather than a casual loanword."*

This communicates the **principle** without exposing the specific Norwegian terms in your live glossary.

#### F2. SOC 2 Type II claim on Fly.io (`about/compliance.mdx:78`)

`| Infrastructure | Fly.io (SOC 2 Type II) on dedicated instances |`

This is accurate — Fly.io publishes their SOC 2 Type II audit. But framing it inside the Tolka compliance table can be read as Tolka having SOC 2, which we don't (we have a SOC 2-compliant **provider**).

**Recommendation:** Reword to make the inheritance explicit:

> *"Hosting provider: Fly.io (Frankfurt). Fly.io is SOC 2 Type II audited; Tolka inherits the operational controls from this provider while maintaining our own application-level safeguards."*

#### F3. The "DIPA summary | Enterprise customers" line (`about/compliance.mdx:89`)

DIPA is Norway-specific (Datatilsynet's Personvernkonsekvensvurdering). Gating it behind Enterprise tier is a pricing decision, but for a privacy-first product, the DIPA summary is exactly the kind of trust artifact that should be available to ALL prospects evaluating you, not gated.

**Recommendation:** "Available on request" rather than "Enterprise customers only" until you have a real tiered offering. Easy to add the gate later.

#### F4. Specific @tolka.health email addresses (3 in compliance.mdx)

`compliance@`, `legal@`, `security@`. None are provisioned. Same pattern as `hello@tolka.health` you removed earlier. Either provision via CF Email Routing (recommended — 5-min config) or replace with `/signup` CTA throughout.

**Recommendation:** Set up CF Email Routing once. All 3 addresses → your real inbox. Docs need no edits.

#### F5. Architecture overview PDF reference

`about/compliance.mdx:91` — "Architecture overview | PDF | Request via signup". The PDF doesn't exist yet. The signup-CTA is honest. But: when you DO produce this PDF, it'll be a real artifact that explains your architecture in detail. Decision needed: how much to include in it?

**Recommendation:** When you draft the architecture PDF, apply the same "tight" bar as this review. Concept-level architecture is fine; specific implementation values (formula weights, thresholds, model names) belong only in customer-specific compliance packs after NDA.

---

### 🟢 Verified clean — no action needed

Audited for the most-likely IP leaks. **None found** in the corpus:

| Pattern | Result |
|---|---|
| Confidence formula weights (0.3, 0.5, 0.2 from CLAUDE.md) | ✅ Not in docs |
| Risk thresholds (0.7, 0.85, 0.9) | ✅ Not in docs |
| System prompt text or templates | ✅ Not in docs |
| Glossary content beyond the 2 policy-permitted examples | ✅ Within policy |
| Phrase library entries | ✅ Not in docs |
| Eval methodology details / golden test specifics | ✅ Not in docs |
| Customer names / pilot partners | ✅ Not in docs |
| Specific p50/p95/p99 latency SLO numbers | ✅ Documented as "varies", no commitments |
| Pricing strategy details | ✅ Discussed at tier level only |
| Roadmap specifics beyond "Q3 dashboard" | ✅ Light-touch |

---

## Execution log (Pass 1 — applied 2026-05-24)

| File | Change |
|---|---|
| `getting-started/quickstart.mdx` | Replace `gpt-4-turbo-2024-04-09` → `tolka-v1` in response example |
| `getting-started/understanding-the-response.mdx` | Same replacement (response example + field-reference table) |
| `about/compliance.mdx` | MDR + EU AI Act framing softened; added "not legal advice" qualifier |
| `changelog/index.mdx` | Removed vendor names from infrastructure lines (kept residency commitment) |

## Pass 2 (self-review) — completed 2026-05-24

### Verifications performed

| Check | Result |
|---|---|
| All `gpt-4-turbo` / `gpt-3.5` / OpenAI string mentions removed | ✅ 0 hits across all 44 pages |
| `"model":` field in every JSON example uses `"tolka-v1"` consistently | ✅ 3 places: quickstart, understanding-the-response, safe-mode |
| Compliance MDR / EU AI Act prose reads naturally with new disclaimers | ✅ verified manually |
| Build still passes after all edits | ✅ 45 pages, 4.75 s, no errors |

### New issue caught in Pass 2 — fixed

The initial pattern scan only matched href attributes, so it missed URLs **inside code blocks**. Pass 2's re-read caught three references to `cdn.tolka.health/sdk/web/.../tolka.min.js` — a CDN URL that doesn't exist (the actual SDK is served from `tolka.health/tolka-sdk.js`).

Locations:
- `changelog/index.mdx:46` — listed as a v1 distribution channel
- `getting-started/quickstart.mdx:45` — Path A "CDN" example
- `guides/telehealth-integration.mdx:25` — telehealth integration snippet

**Fix applied:** Bulk rewrite to `https://tolka.health/tolka-sdk.js` (the URL we actually serve today). When a real CDN subdomain ships, the docs can be updated in one pass — but until then, the links are honest.

This also retroactively closes the gap from the earlier broken-link audit, which didn't flag these because they live inside `<script src="...">` tags rendered as code (not clickable `href=`s).

### Pass 2 summary

Pass 1 + Pass 2 together touched **5 files** with auto-applied IP / accuracy fixes:

| File | Change |
|---|---|
| `getting-started/quickstart.mdx` | `gpt-4-turbo-2024-04-09` → `tolka-v1` (response example); CDN URL fix |
| `getting-started/understanding-the-response.mdx` | `gpt-4-turbo-2024-04-09` → `tolka-v1` (response example + field reference); description rewritten |
| `concepts/safe-mode.mdx` | Already used `tolka-v1` — no change needed |
| `about/compliance.mdx` | MDR position softened with "not legal advice"; EU AI Act framed as assessing not asserting |
| `changelog/index.mdx` | Removed vendor-specific infrastructure names; fixed fake CDN URL |
| `guides/telehealth-integration.mdx` | Fake CDN URL → real one |

**No fixes applied** to:
- `concepts/translation-pipeline.mdx` (F1 disambiguation examples — within policy, flagged for judgment)
- `about/compliance.mdx` SOC 2 framing (F2 — flagged for judgment)
- `about/compliance.mdx` DIPA Enterprise gating (F3 — flagged for judgment)
- `about/compliance.mdx` email addresses (F4 — recommend CF Email Routing instead of doc edits)
- Architecture overview PDF (F5 — doesn't exist yet)

---

## Principal review checklist (your morning task)

When you wake up:

1. **Read this report top to bottom** — should take ~5 minutes
2. **Inspect the diff:** `cd ~/IdeaProjects/tolka-health-docs && git diff` (or `git log -p HEAD~1..HEAD`)
3. **Decide on the 5 flagged items (F1-F5)** above
4. **For each F# you want to apply:** tell Claude in a follow-up, or edit the files directly
5. **When happy with the state, push + redeploy:**
   ```bash
   git push
   pnpm dlx wrangler@4 deploy
   ```

Nothing is pushed or deployed yet. The docs site as of now is unchanged from yesterday's audit-fix deploy. All this work lives only in your local working tree + local commit.
