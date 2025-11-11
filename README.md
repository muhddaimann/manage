# paperNative

Learning template for **Expo + React Native Paper** with **personalized design tokens** and a simple overlay system (Alert / Confirm / Modal / Toast).

## Authors
- [@muhddaimann](https://www.github.com/muhddaimann)

## Quick Start
```bash
npm install
npm run dev - ios

paperNative/
├─ app/
│  ├─ (modals)/
│  │  ├─ _layout.tsx
│  │  ├─ forgot.tsx
│  │  ├─ signIn.tsx
│  │  └─ signUp.tsx
│  ├─ (tabs)/
│  │  ├─ a/
│  │  │  ├─ _layout.tsx
│  │  │  └─ index.tsx
│  │  ├─ b/
│  │  │  ├─ _layout.tsx
│  │  │  └─ index.tsx
│  │  └─ _layout.tsx
│  ├─ _layout.tsx
│  ├─ goodbye.tsx
│  ├─ index.tsx
│  └─ welcome.tsx
├─ assets/
├─ components/
│  ├─ atom/
│  │  ├─ button.tsx
│  │  └─ text.tsx
│  ├─ molecule/
│  │  ├─ alert.tsx
│  │  ├─ confirm.tsx
│  │  ├─ fab.tsx
│  │  ├─ modal.tsx
│  │  └─ toast.tsx
│  └─ shared/
│     └─ header.tsx
├─ constants/
│  ├─ design.ts
│  └─ theme.ts
├─ contexts/
│  ├─ authContext.tsx
│  ├─ designContext.tsx
│  ├─ overlayContext.tsx
│  └─ themeContext.tsx
├─ hooks/
│  ├─ useBlog.tsx
│  ├─ useOverlay.tsx
│  └─ useText.tsx
├─ .gitignore
├─ app.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ tsconfig.json




Klek – collect/claim/back finance app
├─ About
│ ├─ Mission — Turn fronts into fast reimbursements.
│ ├─ Problem — You pay first; collecting is slow.
│ ├─ Outcome — Cashflow kept intrack.
├─ User Persona
│ ├─ Primary — Young pro, fronts meals/rides.
│ ├─ Secondary — Small teams, housemates.
│ ├─ Pain — Forget who owes; awkward chasing.
├─ Value Props
│ ├─ 1-tap log; auto split.
│ ├─ Smart reminders; nice tone.
│ ├─ Clear “owed today” number.
├─ Core Flows
│ ├─ Create Expense — Add, split, assign payers.
│ ├─ Send Link — Share claim via deep link/QR.
│ ├─ Track Status — Unpaid/partial/paid.
│ ├─ Settle — Mark paid; record method.
│ ├─ Nudge — Gentle reminder with context.