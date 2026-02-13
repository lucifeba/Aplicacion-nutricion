# CLAUDE.md - APD Sport Nutrition & Training App

## Project Overview

Mobile application for **APD Sport** - a nutrition and training coaching platform. Enables real-time communication between a nutritionist/trainer (admin) and their clients. Built with React Native (Expo) and TypeScript.

## Tech Stack

- **Framework**: React Native via Expo SDK (TypeScript)
- **Navigation**: `@react-navigation/native` with native-stack and bottom-tabs
- **Chat**: `react-native-gifted-chat`
- **Storage**: `expo-secure-store` (encrypted local storage)
- **Notifications**: `expo-notifications` (push + local)
- **PDF Export**: `expo-print` + `expo-sharing`
- **Icons**: `@expo/vector-icons` (Ionicons)
- **IDs**: `uuid` v4

## Project Structure

```
src/
├── components/       # Reusable UI components (Button, Input, Card, SliderInput, SuccessModal)
├── context/          # React Context providers
│   ├── AuthContext.tsx    # Authentication state, login/register/logout/password reset
│   └── DataContext.tsx    # App data: messages, training requests, feedback, notifications
├── navigation/
│   └── AppNavigator.tsx  # Root navigator with auth/client/admin/onboarding stacks
├── screens/
│   ├── auth/             # LoginScreen, RegisterScreen, ForgotPasswordScreen
│   ├── onboarding/       # 5-step onboarding wizard for new clients
│   ├── client/           # ClientHome, ClientChat, TrainingRequest, WeeklyFeedback, ExportPDF
│   └── admin/            # AdminHome, AdminClientChat, AdminBroadcast, AdminRequests, AdminFeedbacks
├── services/
│   └── notifications.ts  # Push notification registration and local notification helpers
├── theme/
│   ├── colors.ts         # APD Sport brand color palette
│   └── index.ts          # Spacing, border radius, font sizes, font weights
└── types/
    └── index.ts          # TypeScript interfaces for all data models
```

## Commands

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator (macOS only)
npm run web        # Run in web browser
npx tsc --noEmit   # TypeScript type checking (no test framework configured yet)
```

## Architecture & Conventions

### Authentication
- **Admin credentials**: `admin@apdsport.com` / `APDSport2024!Admin` (single admin account, hardcoded)
- **Client accounts**: Self-registration with email/password stored in SecureStore
- **Password reset**: Generates temporary password `Reset1234!`
- Navigation flow: Login → (new client) Onboarding → Client Home | (admin) Admin Home

### Data Persistence
- All data stored locally via `expo-secure-store` (JSON serialized)
- Keys: `currentUser`, `allUsers`, `passwords`, `messages`, `trainingRequests`, `feedbacks`, `notifications`, `onboarding_{userId}`
- No backend server - data is device-local

### State Management
- Two React Contexts: `AuthContext` (user session) and `DataContext` (app data)
- Both wrap the entire app in `App.tsx`

### Branding - APD Sport
- **Primary**: `#1B2A4A` (dark navy blue)
- **Secondary/Accent**: `#E8A838` (gold/amber)
- **Background**: `#F5F7FA`
- All colors defined in `src/theme/colors.ts`

### UI Components
- All reusable components are in `src/components/`
- `Button` supports variants: `primary`, `secondary`, `outline`, `ghost`
- `SliderInput` renders 1-10 selectable dots (used in feedback forms)
- `SuccessModal` shown after successful form submissions

### Navigation Structure
- **Auth Stack**: Login, Register, ForgotPassword (shown when no user)
- **Onboarding Stack**: Shown for new clients who haven't completed onboarding
- **Client Stack**: Home, Chat, TrainingRequest, WeeklyFeedback, ExportPDF
- **Admin Stack**: Home, ClientChat, Broadcast, Requests, Feedbacks

### Client Features
1. **Messaging** - Real-time chat with trainer via GiftedChat
2. **Training Modification** - Form to request routine changes (with injury flag)
3. **Weekly Feedback** - Comprehensive questionnaire (1-10 scales + text fields)
4. **PDF Export** - Generate branded PDF report of all feedback history

### Admin Features
1. **Dashboard** - Stats overview (clients, pending requests, recent feedback, alerts)
2. **Client Management** - List all clients, tap to open individual chat
3. **Broadcast Messages** - Send message to all clients at once
4. **Review Requests** - Approve/reject training modification requests
5. **View Feedbacks** - Browse all client weekly feedback submissions

## Coding Guidelines

- Language: TypeScript strict mode
- UI text: Spanish (all user-facing strings are in Spanish)
- Styles: `StyleSheet.create()` at bottom of each component file
- All theme tokens imported from `src/theme/`
- Forms show `SuccessModal` on submission with confirmation message
- Notifications created in `DataContext` whenever data is submitted (messages, feedback, requests)

## Known Limitations

- No backend server - all data is local to the device
- Chat is not truly real-time (polling-based via context re-renders)
- Admin credentials are hardcoded (not suitable for production without a backend)
- SecureStore has a ~2KB limit per key on some platforms; large datasets may need AsyncStorage migration
