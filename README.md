# 🎟️ Coupon Engine

A production-quality React Native coupon engine app built with Expo, featuring a complete validation pipeline, premium dark-mode UI, and clean feature-based architecture.


---

## 🚀 Live Preview & Demo for Recruiters

Test the working application instantly on Web, Mobile via Expo Go, or Standalone Android APK:

| Platform | Preview Method | Action Link / QR Code |
|---|---|---|
| 🌐 **Web Browser** | Instant Browser Preview | 👉 **[Launch Live Web Preview](https://bprince203.github.io/Coupon-Engine/)** |
| 📱 **Expo Go App** | Cloud Scan via Expo Go | 👉 **[Open Expo Go Cloud Page](https://expo.dev/accounts/bprince203/projects/coupon-engine/updates/b3665561-4659-4b73-8e47-619c2f596ce5)** |
| 📦 **Android APK** | Direct APK Installation | 👉 **[Download Standalone APK](https://expo.dev/accounts/bprince203/projects/coupon-engine/builds/32e93e7a-b9c0-44f0-863a-ccf5ec7dd444)** |

### 📲 Expo Go QR Code
Scan this QR Code using **Expo Go** on your Android/iOS phone to launch the app immediately:

<div align="center">

<img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Fexpo.dev%2Faccounts%2Fbprince203%2Fprojects%2Fcoupon-engine%2Fupdates%2Fb3665561-4659-4b73-8e47-619c2f596ce5" width="220" height="220" alt="Expo Go QR Code" />

*Scan with Expo Go App*

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Validation Engine](#validation-engine)
- [Tech Stack & Engineering Decisions](#tech-stack--engineering-decisions)
- [Setup & Running](#setup--running)
- [Testing](#testing)
- [AI-Assisted Development](#ai-assisted-development)
- [Future Improvements](#future-improvements)

---

## Overview

The app allows users to:

- **Browse** available discount coupons with search and filtering
- **View** detailed coupon information with copy-to-clipboard
- **Validate** coupon codes against a cart total with real-time feedback
- **Track** applied coupons within the session

### Key Features

| Feature | Implementation |
|---|---|
| Coupon listing with search & filter | FlashList + debounced search + type filters |
| Coupon detail with copy code | Clipboard API + toast feedback |
| Coupon validation | Pipeline-based ValidationEngine |
| Applied coupons management | Zustand store with add/remove |
| Loading states | Skeleton loaders with Reanimated pulse |
| Error states | Error view with retry |
| Empty states | Illustrated empty views |
| Animations | Reanimated spring animations, FadeIn, scale-on-press |
| Dark/Light theme | ThemeProvider with full color system |

---

## Screenshots

> *Screenshots to be added after running the app*

| Coupon List | Coupon Detail | Validator | Applied |
|---|---|---|---|
| *Loading skeleton → Card list* | *Code + details + copy* | *Form + result card* | *Applied list + savings* |

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    App.tsx                           │
│       GestureHandler → SafeArea → QueryClient       │
│              → Theme → Navigation                   │
├─────────────────────────────────────────────────────┤
│                  Navigation Layer                    │
│         BottomTabs → CouponStack / Screens          │
├─────────────────────────────────────────────────────┤
│                   Screen Layer                       │
│   (Orchestrates hooks + components, no biz logic)   │
├──────────────┬──────────────┬───────────────────────┤
│  Components  │    Hooks     │    Zustand Stores      │
│  (Pure UI)   │ (Data flow)  │ (Client state)         │
├──────────────┴──────────────┴───────────────────────┤
│                  Service Layer                       │
│   ValidationEngine → Validators → DiscountCalc      │
├─────────────────────────────────────────────────────┤
│                    API Layer                          │
│           Mock API (couponApi + mockData)            │
└─────────────────────────────────────────────────────┘
```

### Design Principles

- **Feature-Based Architecture**: All coupon-related code lives in `src/features/coupons/`, making it easy to navigate, test, and extend.
- **Separation of Concerns**: Screens orchestrate; services compute; components render. Business logic never lives in UI components.
- **Dependency Inversion**: Validators implement a `CouponValidator` interface, making the pipeline extensible without modifying the engine.
- **Clean Layering**: API → Types → Services → Stores → Hooks → Components → Screens

---

## Folder Structure

```
src/
├── features/coupons/          # Feature module
│   ├── api/                   # Mock API + data
│   │   ├── couponApi.ts       # Async API functions with simulated latency
│   │   └── mockData.ts        # 12 diverse coupon fixtures
│   ├── components/            # Feature-specific UI components
│   │   ├── CouponCard.tsx     # List item card
│   │   ├── StatusBadge.tsx    # Active/Expired pill
│   │   ├── DiscountChip.tsx   # Colored discount badge
│   │   ├── FilterTabs.tsx     # Horizontal filter pills
│   │   ├── CouponCardSkeleton.tsx  # Loading skeleton
│   │   ├── ValidatorResultCard.tsx # Success/error result display
│   │   ├── PriceSummary.tsx   # Cart → discount → final price
│   │   └── AppliedCouponItem.tsx   # Applied coupon row
│   ├── hooks/                 # React Query + custom hooks
│   │   ├── useCoupons.ts      # Fetch coupon list
│   │   ├── useCouponById.ts   # Fetch single coupon
│   │   ├── useSearchCoupons.ts # Debounced search + filter
│   │   └── useClipboard.ts   # Clipboard copy hook
│   ├── screens/               # Screen components (orchestration only)
│   │   ├── CouponListScreen.tsx
│   │   ├── CouponDetailScreen.tsx
│   │   ├── CouponValidatorScreen.tsx
│   │   └── AppliedCouponsScreen.tsx
│   ├── services/              # Business logic (zero UI dependencies)
│   │   ├── ValidationEngine.ts     # Pipeline orchestrator
│   │   ├── DiscountCalculator.ts   # Discount math
│   │   ├── ClipboardService.ts     # Clipboard abstraction
│   │   └── validators/             # Individual validation rules
│   │       ├── CodeValidator.ts
│   │       ├── ExpiryValidator.ts
│   │       ├── MinimumOrderValidator.ts
│   │       └── CategoryValidator.ts
│   ├── store/                 # Zustand state stores
│   │   ├── useCouponStore.ts  # Applied coupons
│   │   ├── useFilterStore.ts  # Search/filter UI state
│   │   └── useValidatorStore.ts # Validation result
│   ├── validators/            # Zod form schemas
│   │   └── couponFormSchema.ts
│   ├── types/                 # TypeScript domain types
│   ├── constants/             # Feature constants
│   └── utils/                 # Pure utility functions
├── shared/                    # Reusable across features
│   ├── components/            # Generic UI components
│   ├── hooks/                 # useDebounce, useToast
│   └── constants/             # Layout tokens
├── navigation/                # React Navigation setup
│   ├── RootNavigator.tsx      # Bottom tabs
│   ├── CouponStackNavigator.tsx # Stack (List → Detail)
│   └── navigationTypes.ts     # Typed route params
└── theme/                     # Design system
    ├── colors.ts              # Dark + light palettes
    ├── typography.ts          # Type scale
    ├── spacing.ts             # 4px grid
    ├── shadows.ts             # Elevation presets
    └── ThemeContext.tsx        # Theme provider + hook
```

**Why this structure?**
- **Feature-first**: Everything related to coupons is co-located. If we add a "Promotions" feature, it gets its own directory — zero changes to existing code.
- **Shared layer**: Truly reusable components (Button, Toast, EmptyView) live in `shared/` — they're feature-agnostic.
- **Navigation is isolated**: Route types and navigators are separate from features, making them easy to reconfigure.

---

## Validation Engine

The coupon validation uses a **Chain of Responsibility** pattern:

```
Input (code, cartTotal)
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ CodeValidator │ ──▶ │ExpiryValidator│ ──▶ │MinOrderValidator │ ──▶ │CategoryValidator │
└──────┬───────┘     └──────┬───────┘     └──────┬───────────┘     └──────┬───────────┘
       │                    │                     │                        │
    invalid?             expired?              below min?             wrong cat?
    → STOP               → STOP                → STOP                 → STOP
       │                    │                     │                        │
       ▼                    ▼                     ▼                        ▼
                                                              ┌──────────────────┐
                                                              │DiscountCalculator│
                                                              └──────┬───────────┘
                                                                     │
                                                                     ▼
                                                             ValidationResult
                                                          { isValid, discount,
                                                            finalPrice, coupon }
```

**Why this pattern?**
- **Fail-fast**: Pipeline halts at the first failure — no unnecessary computation.
- **Single Responsibility**: Each validator does exactly one check.
- **Open/Closed**: Adding a new rule (e.g., `UsageLimitValidator`) requires creating one new class — zero changes to existing code.
- **Testable**: Each validator is a pure class with injectable dependencies (e.g., `ExpiryValidator` accepts a `now` parameter for deterministic testing).

### Where is the validation logic?

The validation logic lives in `src/features/coupons/services/` — completely separated from any UI code. The `ValidationEngine.ts` orchestrates the pipeline, while individual validators live in `services/validators/`.

**Why separate?**
1. Screens should only orchestrate — they call `validateCoupon()` and render the result.
2. The engine can be unit tested without any React rendering.
3. If we migrate to a backend, the same pipeline pattern works server-side.

### How would server-side validation work?

```
Client                          Server
  │                               │
  ├── POST /validate ────────────▶│
  │   { code, cartTotal }         │
  │                               ├── Same Pipeline:
  │                               │   CodeValidator (DB lookup)
  │                               │   ExpiryValidator
  │                               │   MinOrderValidator
  │                               │   UsageLimitValidator ← (new!)
  │                               │   RateLimitValidator  ← (new!)
  │                               │   DiscountCalculator
  │                               │
  │◀── ValidationResult ─────────┤
  │   { isValid, discount, ... }  │
```

The pipeline architecture makes this migration straightforward — validators are decoupled from the data source.

---

## Tech Stack & Engineering Decisions

| Technology | Why |
|---|---|
| **Expo SDK 57** | Managed workflow eliminates native build complexity. Ideal for rapid development while supporting all required features. |
| **TypeScript (strict)** | Catches type errors at compile time. Strict mode enforces exhaustive checks, proper null handling, and interface contracts. |
| **React Navigation** | Assignment requirement. Mature library with type-safe navigation params via generics. |
| **TanStack React Query v5** | Server-state management with built-in caching, retry, stale-while-revalidate, and refetch. Eliminates manual loading/error state management. |
| **Zustand** | Minimal client-state management. No provider wrapping, no context hell, no boilerplate. Stores are just hooks — simple to test and compose. |
| **React Hook Form + Zod** | React Hook Form avoids re-renders on every keystroke (unlike controlled inputs). Zod provides runtime schema validation that mirrors TypeScript types. |
| **FlashList** | Shopify's high-performance list — uses recycling for consistent 60fps scrolling. Drop-in FlatList replacement. |
| **Reanimated 3** | Runs animations on the UI thread — smooth 60fps regardless of JS thread load. Used for card entrance animations, skeleton shimmer, scale-on-press, and toast slide-in. |
| **Expo Clipboard** | Cross-platform clipboard access with a simple async API. |

### Why Zustand over Redux / Context?

- **Zero boilerplate**: No actions, reducers, action types, or providers.
- **Selective subscriptions**: Components only re-render when the specific slice they use changes.
- **Middleware support**: Can add `persist` (MMKV) or `devtools` without refactoring.
- **It's just a hook**: `const count = useStore(s => s.count)` — no wrapping, no connecting.

### Why React Query over useEffect + useState?

- **Automatic caching**: Fetched data is cached and shared across components.
- **Built-in retry**: Configurable exponential backoff on failure.
- **Background refetch**: Stale data is shown instantly while fresh data loads.
- **Eliminates state boilerplate**: No manual `isLoading`, `isError`, `data` state management.

---

## Setup & Running

### Prerequisites

- Node.js 18+ (22.x recommended)
- npm 9+
- Expo CLI (`npx expo`)
- iOS Simulator (macOS) or Android Emulator, or Expo Go app on a physical device

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd CouponEngine

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

- **Expo Go**: Scan the QR code from the terminal
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal

### Running Tests

```bash
npm test
```

---

## Testing

### Test Coverage

| Module | Tests | Coverage |
|---|---|---|
| DiscountCalculator | 12 tests | Percentage, flat, free shipping, caps, zero/negative cart, 100% |
| ValidationEngine | 14 tests | Valid/invalid codes, expired, min order, categories, case sensitivity |
| Individual Validators | 11 tests | Expiry, minimum order, category with edge cases |
| Utility Functions | 8 tests | Currency formatting, date formatting, expiry checking |

### Edge Cases Tested

- ✅ Expired coupon
- ✅ Cart below minimum order value
- ✅ Cart equals minimum exactly
- ✅ Invalid/non-existent coupon code
- ✅ Empty and whitespace-only codes
- ✅ Zero cart total
- ✅ Negative cart total
- ✅ 100% discount
- ✅ Flat discount larger than cart total
- ✅ Percentage discount with maxDiscount cap
- ✅ Free shipping (zero discount)
- ✅ Case-insensitive code matching
- ✅ Category mismatch
- ✅ "All" categories wildcard

---

## AI-Assisted Development

### Tools Used

- **Gemini (Antigravity IDE)** — primary coding assistant

### How AI Was Used

1. **Architecture Planning**: Used AI to outline the feature-based folder structure and validation pipeline pattern.
2. **Boilerplate Generation**: AI generated initial component scaffolding, type definitions, and theme tokens.
3. **Test Case Generation**: AI helped enumerate edge cases for the DiscountCalculator and ValidationEngine.
4. **Documentation**: README structure and content were AI-assisted.

### What Was Manually Implemented / Corrected

1. **Validation Pipeline Design**: The Chain of Responsibility pattern and its interface contract were designed with careful architectural consideration — AI provided the skeleton, but the separation of concerns was manually refined.
2. **Type Safety Fixes**: Fixed TypeScript strict-mode issues with React Navigation header styles and FlashList v2 API changes.
3. **Theme Color Palette**: Curated the dark/light color palette to match CRED/Linear design aesthetic rather than using AI-suggested generic colors.
4. **Edge Case Logic**: Manually verified that `calculateDiscount` correctly handles negative carts, caps, and exhaustive switch statements.
5. **Dependency Resolution**: Resolved npm peer dependency conflicts between React 19 and test libraries.

### How Correctness Was Validated

1. **TypeScript strict compilation** — `npx tsc --noEmit` passes with zero errors
2. **Unit tests** — All business logic tested with edge cases
3. **Manual testing** — Verified all 4 screens on device/simulator
4. **Architecture review** — Ensured no business logic in screens, no circular dependencies

---

## Future Improvements

### Near-Term
- [ ] Add haptic feedback on coupon apply/copy
- [ ] Implement swipe-to-remove gesture on applied coupons
- [ ] Add coupon usage count tracking (client-side)
- [ ] Add animated confetti on successful validation

### Backend Integration
- [ ] Replace mock API with REST/GraphQL endpoints
- [ ] Add server-side validation with rate limiting
- [ ] Implement coupon usage limits per user
- [ ] Add real-time coupon availability via WebSocket

### Scale
- [ ] Add a promotions/deals feature module
- [ ] Implement A/B testing for coupon display
- [ ] Add analytics event tracking
- [ ] Implement deep linking for coupon sharing
- [ ] Add offline-first with MMKV persistence + sync queue
