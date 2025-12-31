# 🏢 Faith Manage

Manager and admin system for overseeing people, approvals, and workplace operations.

---

## Brand Tagline

Faith Manage — Leading teams with clarity and control

### Brand Colors

- primary: '#5B5F97',
- secondary: '#A14F66',

```bash

├─ About
│ ├─ Mission — Enable managers and admins to efficiently oversee teams and workplace operations.
│ ├─ Problem — Managers and HR lack a clear, centralized system to approve requests, monitor attendance, and manage resources.
│ ├─ Outcome — Faster approvals, better oversight, and smoother people operations.
│ ├─ Positioning — A management and approval system (not a full enterprise HR or payroll platform).
│
├─ User Persona
│ ├─ Primary — People managers approving leave and monitoring team activity.
│ ├─ Secondary — HR and admins managing announcements and office resources.
│ ├─ Tertiary — Operations leads overseeing workforce availability.
│
│ ├─ Pain
│ │ ├─ Manual or delayed leave approvals.
│ │ ├─ Limited visibility into team attendance.
│ │ ├─ Announcements difficult to manage and track.
│ │ ├─ Office room usage lacks oversight.
│
│ ├─ Goal
│ │ ├─ Review and approve employee leave efficiently.
│ │ ├─ Monitor team attendance and availability.
│ │ ├─ Publish and manage company announcements.
│ │ ├─ Oversee office room bookings and usage.
│
├─ Core Jobs-to-be-Done
│ ├─ Approve — Review and act on employee leave requests.
│ ├─ Monitor — Track team attendance and work status.
│ ├─ Communicate — Create and manage announcements.
│ ├─ Oversee — Manage office room availability and bookings.
│
├─ Core Features
│ ├─ Attendance Oversight
│ │ ├─ View team and department attendance.
│ │ ├─ Filters by date, status, and employee.
│
│ ├─ Leave Approvals
│ │ ├─ Approve or reject leave applications.
│ │ ├─ View leave history and balances.
│ │ ├─ Approval audit trail.
│
│ ├─ Announcements Management
│ │ ├─ Create, edit, and publish announcements.
│ │ ├─ Track read and acknowledgment status.
│
│ ├─ Office Room Management
│ │ ├─ Manage room availability and time slots.
│ │ ├─ View all bookings and resolve conflicts.
│
│ ├─ User & Profile Oversight
│ │ ├─ View employee profiles and roles.
│ │ ├─ Basic role and access visibility.
│
├─ Quality-of-life
│ ├─ Dashboard-focused layout for quick decisions.
│ ├─ Web and tablet friendly experience.
│ ├─ Fast access to approvals and alerts.
│ ├─ Light and dark mode support.
│
├─ Non-Goals (for now)
│ ├─ No payroll, tax, or accounting modules.
│ ├─ No advanced performance appraisal system.
│ ├─ No external recruitment or onboarding workflows.
```

manage/
├─ .expo/
│  ├─ types/
│  │  └─ router.d.ts
│  ├─ web/
│  │  └─ cache/
│  │     └─ production/
│  │        └─ images/
│  │           └─ favicon/
│  │              └─ favicon-24272cdaeff82cc5facdaccd982a6f05b60c4504704bbf94c19a6388659880bb-contain-transparent/
│  │                 └─ favicon-48.png
│  ├─ devices.json
│  └─ README.md
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
│  ├─ a/
│  │  └─ header.tsx
│  ├─ b/
│  │  └─ header.tsx
│  └─ shared/
│     ├─ alert.tsx
│     ├─ confirm.tsx
│     ├─ header.tsx
│     ├─ modal.tsx
│     └─ toast.tsx
├─ constants/
│  ├─ design.ts
│  └─ theme.ts
├─ contexts/
│  ├─ authContext.tsx
│  ├─ designContext.tsx
│  ├─ overlayContext.tsx
│  └─ themeContext.tsx
├─ hooks/
├─ .gitignore
├─ app.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ tsconfig.json
