# Authentication & Onboarding Flow

This document details the authentication states, onboarding steps, route protection rules, and mock API contracts for InterviewIQ.

## Authentication State Model

1. **Unauthenticated:** No session token exists. Redirected to `/login` if attempting to access protected routes.
2. **Login:** User submits credentials. On success, transitions to `Onboarding Required` or `Authenticated`.
3. **Register:** User submits name, email, password. On success, transitions to `Email Verification`.
4. **Email Verification (Mock):** User sees verification screen. Mocks successful verification to `Onboarding Required`.
5. **Onboarding Required:** Token exists but `hasCompletedOnboarding` is false. User is forced to `/onboarding`.
6. **Authenticated:** Token exists, `hasCompletedOnboarding` is true. Allowed into `/dashboard` and protected routes.

## Route Protection Rules

- **Public Routes:** `/`, `/about`, `/contact` (Accessible by all)
- **Auth Routes:** `/login`, `/register`, `/forgot-password`, `/reset-password` (Accessible only by Unauthenticated users. Authenticated users are redirected to `/dashboard`).
- **Protected Routes:** `/dashboard`, `/interview`, `/analytics`, etc. (Accessible only by Authenticated users).
- **Onboarding Route:** `/onboarding` (Accessible only by users in the `Onboarding Required` state).

## Onboarding Steps (Persistent)

The onboarding flow tracks `completedStep` locally or via mock API to allow resuming.

1. **Step 1 - Personal Info:** Full Name, Profile Photo, Graduation Year, College, Degree.
2. **Step 2 - Career Goals:** Target Role, Experience Level, Preferred Companies, Primary Language.
3. **Step 3 - Skills:** Multi-select chips for technologies (React, Next.js, Node.js, etc.).
4. **Step 4 - Preferences:** Preferred Interview Type, Daily Goal, Difficulty, Theme, Notifications.

## Mock API Contracts

### POST `/api/auth/login`
- **Request:** `{ email, password }`
- **Response:** `{ token, user: { id, email, name, hasCompletedOnboarding, onboardingStep } }`

### POST `/api/auth/register`
- **Request:** `{ name, email, password }`
- **Response:** `{ token, user }`

### POST `/api/auth/onboarding`
- **Request:** `Partial<OnboardingData>` & `{ currentStep }`
- **Response:** `{ success: true, nextStep: number }`
