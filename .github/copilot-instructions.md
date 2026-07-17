# TrustHerBro Copilot Instructions

## Project Overview
**TrustHerBro** is a safety-first travel companion app for solo female travelers (Vietnamese context). Built with Next.js 15 App Router + React 18, TypeScript, Supabase, OpenAI, and VBee TTS.

**Core Purpose**: Provide real-time safety guidance during travel's critical first night and throughout the journey via AI-driven risk assessment, survival timelines, and emergency assistance.

## Architecture

### Key Service Boundaries
1. **Frontend Pages** (`app/page.tsx`, `app/*/page.tsx`):
   - Landing/mode selection (entry point)
   - `onboarding/page.tsx`: First-night questionnaire
   - `timeline/page.tsx`: Displays AI-generated survival timeline
   - `safety/page.tsx`: Real-time safety chat with risk assessment
   - `assistant/page.tsx`, `emergency/page.tsx`: Stubs (future expansion)

2. **API Routes** (`app/api/*/route.ts`):
   - `POST /api/first-night`: Takes onboarding answers → returns `SurvivalTimelinePayload` (with fallback)
   - `POST /api/safety-check`: Takes user message → returns `RiskAssessment` (risk level, route suggestions)
   - `POST /api/trust-check`: Evaluates trustworthiness of people/situations (stub)
   - `POST /api/mode-router`: Routes user between app modes based on context (stub)
   - `POST /api/tts`: Triggers VBee text-to-speech for discreet mode (stub)

3. **AI Layer** (`lib/ai/`):
   - `openai.ts`: Generic JSON request wrapper using OpenAI
   - `vbee.ts`: VBee TTS integration (stub)
   - `prompts/`: System prompts for each API endpoint (e.g., `firstNightPrompt.ts`)
   - `types.ts`: Shared TypeScript interfaces + sample data

4. **Data & Utilities**:
   - `lib/data/`: Static JSON files (emergency contacts, scam warnings, community reports)
   - `utils/supabase/`: Client/server/middleware for Supabase auth + session
   - `lib/utils/`: Risk scoring, geolocation helpers

### Data Flow Example: First Night Feature
```
User Input (OnboardingForm)
  ↓
POST /api/first-night with answers
  ↓
buildFirstNightPrompt() + answers → runOpenAIJson()
  ↓
SurvivalTimelinePayload (with fallback on error)
  ↓
SurvivalTimeline component renders steps
```

## Critical Developer Workflows

### Local Setup
```bash
npm install
npm run dev  # Starts on http://localhost:3000
```

### Build & Deploy
```bash
npm run build    # Builds Next.js app
npm run start    # Production server
npm run lint     # Runs Next.js linter
```

### Environment Variables (`.env.local`)
- `OPENAI_API_KEY`: OpenAI API key for chat/JSON models
- `VBEE_API_KEY`: Vietnamese text-to-speech API
- `MAPS_API_KEY`: Google Maps (used in safety routing)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase anon key
- Server-only keys for Supabase SSR flow (in deployment secrets)

### Key Patterns

#### 1. **API Route Pattern: JSON + Fallback**
All AI endpoints follow this pattern to ensure graceful degradation:
```typescript
// Example: app/api/first-night/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const fallback = buildFallbackTimeline(body.answers);
  
  try {
    return NextResponse.json(await runOpenAIJson({
      systemPrompt: buildFirstNightPrompt(),
      userPrompt: JSON.stringify(body.answers),
      fallback,
    }));
  } catch {
    return NextResponse.json(fallback);
  }
}
```
**Why**: Network/API failures mustn't break the UX. Always provide sensible defaults.

#### 2. **Component State Pattern: Answer Collection**
Onboarding and safety chat components use React hooks to collect partial data, then POST:
```typescript
const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
// User fills fields → state updates
// Submit → fetch("/api/first-night", { body: JSON.stringify({ answers }) })
```

#### 3. **Prompt Engineering Pattern**
Prompts live in `lib/ai/prompts/` as functions returning strings:
```typescript
export function buildFirstNightPrompt() {
  return [
    "You are a travel safety assistant for solo female travelers.",
    "Return valid JSON only.",
    // ... detailed constraints
  ].join(" ");
}
```
**Reason**: Easy to version, test, and localize (e.g., Vietnamese variants).

#### 4. **Type-First Design**
All payloads defined in `lib/ai/types.ts`:
- `OnboardingAnswers`, `SurvivalTimelinePayload`, `RiskAssessment`, `ChatMessage`, etc.
- Sample data (`sampleTimeline`) for UI preview when API unavailable
- Type imports used across components → compile-time safety

#### 5. **Middleware + Server Components**
- `middleware.ts` wraps all requests to initialize Supabase session
- Server components (`app/page.tsx`) call `createClient(cookieStore)` for authenticated queries
- Client components (`"use client"`) use `createBrowserClient()` for realtime features
- Follows Supabase SSR best practice

#### 6. **Styling: Inline CSSProperties**
No CSS files (yet). Inline React CSSProperties with design tokens:
- Colors: `#172554` (dark blue), `#fff7ed` (cream), `#eff6ff` (light blue)
- Spacing: Multiples of 4px (8, 12, 16, 20, 24, 28)
- Radius: 12–24px for card roundness
- Used throughout for consistency (e.g., `inputStyle`, `heroCard` in `page.tsx`)

## Common Tasks & Implementation Examples

### Adding a New API Endpoint
1. Create `app/api/[feature]/route.ts`
2. Define request/response types in `lib/ai/types.ts`
3. Write prompt function in `lib/ai/prompts/[feature]Prompt.ts`
4. Use `runOpenAIJson()` with fallback; catch errors gracefully
5. Reference in a new page component or existing SafetyChat

### Adding a UI Component
- Use `"use client"` directive if using hooks or event handlers
- Prefer inline `CSSProperties` to match existing style
- Type all props using types from `lib/ai/types.ts`
- Follow naming: `[Feature]Component.tsx` in `components/[feature]/`

### Debugging AI Responses
- Check `lib/ai/openai.ts` for request formatting
- Verify prompt function builds complete system message
- Test with sample JSON in prompt to ensure schema clarity
- Fallback data in `lib/ai/types.ts` provides safe debugging alternative

## Codebase Navigation
- **Layout & routing**: `app/` and `app/api/`
- **Shared UI**: `components/shared/` (ChatInput, TrustBadge)
- **Feature components**: `components/[feature]/` (onboarding, safety, timeline, etc.)
- **AI logic**: `lib/ai/` (prompts, types, OpenAI wrapper)
- **Auth & DB**: `utils/supabase/` + `lib/data/`

## Notes for AI Agents
- **Vietnamese context**: Comments, README, and some UI text reference Vietnamese travel scenarios
- **Safety-first mindset**: All responses should err on side of caution (low vs. medium risk levels)
- **Stub APIs**: `trust-check`, `mode-router`, `tts` exist as routes but are incomplete—expand carefully with clear fallbacks
- **No external tests yet**: Verify changes locally with `npm run dev`
