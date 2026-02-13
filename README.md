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


├─ Push Notification Module
│  ├─ Purpose
│  │  ├─ Enable real-time push notifications via Expo
│  │  ├─ Support multi-device per staff
│  │  ├─ Provide scalable foundation for targeting & broadcast
│  │  └─ Maintain token lifecycle management
│  │
│  ├─ Core Components
│  │  ├─ Mobile App (Expo)
│  │  ├─ Backend API (PHP + JWT)
│  │  ├─ Database (MySQL)
│  │  └─ Expo Push Server
│  │
│  ├─ Authentication Flow
│  │  ├─ User Login
│  │  │  ├─ Verify credentials
│  │  │  └─ Issue JWT (staff_id, SiteDepartmentProfileID)
│  │  ├─ App stores JWT
│  │  └─ All push APIs require Authorization: Bearer <token>
│  │
│  ├─ Token Registration Flow
│  │  ├─ After login
│  │  ├─ Request notification permission
│  │  ├─ Retrieve Expo Push Token
│  │  ├─ POST /push/register
│  │  │  ├─ Validate JWT
│  │  │  ├─ Resolve staff_id
│  │  │  └─ Insert/Update token
│  │  └─ Token marked IsActive = 1
│  │
│  ├─ Token Deactivation Flow
│  │  ├─ Triggered on logout
│  │  ├─ POST /push/unregister
│  │  └─ Set IsActive = 0
│  │
│  ├─ Database Tables
│  │  ├─ staff
│  │  │  └─ Core user identity table
│  │  │
│  │  ├─ staff_push_token
│  │  │  ├─ ID (PK)
│  │  │  ├─ StaffID (FK reference to staff)
│  │  │  ├─ ExpoPushToken (UNIQUE)
│  │  │  ├─ DeviceType (ios/android)
│  │  │  ├─ IsActive (1/0)
│  │  │  ├─ CreatedAt
│  │  │  └─ UpdatedAt
│  │  │
│  │  └─ push_notification_log
│  │     ├─ ID (PK)
│  │     ├─ StaffID
│  │     ├─ ExpoPushToken
│  │     ├─ Title
│  │     ├─ Body
│  │     ├─ Status
│  │     ├─ ExpoResponse
│  │     └─ CreatedAt
│  │
│  ├─ Simple Send Flow
│  │  ├─ Admin triggers send
│  │  ├─ Backend fetches active tokens
│  │  ├─ Send batch (≤100 tokens) to Expo API
│  │  ├─ Expo delivers to devices
│  │  └─ Log result (success / failure)
│  │
│  ├─ Expo Integration
│  │  ├─ Endpoint: https://exp.host/--/api/v2/push/send
│  │  ├─ Payload includes:
│  │  │  ├─ to (ExpoPushToken)
│  │  │  ├─ title
│  │  │  ├─ body
│  │  │  └─ data (optional metadata)
│  │  └─ Handle DeviceNotRegistered error
│  │
│  ├─ Token Lifecycle Management
│  │  ├─ Register on login
│  │  ├─ Deactivate on logout
│  │  ├─ Disable if invalid token response
│  │  └─ Support multi-device per staff
│  │
│  └─ Future Enhancements
│     ├─ Department-based targeting
│     ├─ Broadcast-triggered push
│     ├─ Scheduled notifications
│     ├─ Queue-based processing
│     └─ Delivery analytics dashboard


```