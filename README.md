# Mindmate — Every Memory Matters

> **Cognitive Wellness, Memory Assistance, Relaxation, and Caregiver Support Platform**  
> *Independent, Professional Cognitive Wellness Platform*

---

## 🌸 Executive Summary

**Mindmate** is a compassionate, accessible web application designed primarily for older adults, including individuals experiencing memory difficulties or early cognitive decline, as well as their caregivers.

Mindmate does **not** claim to diagnose, treat, prevent, or cure dementia, Alzheimer's, or any medical condition. Instead, it serves as an approachable, supportive, and calming daily wellness companion.

---

## 🌟 Core Features & Modules

### 1. Unified Night & Day Design System (Phase 17 Verified)
- **Caregiver & Patient Dark Mode Parity**: Patient night mode uses the exact same mild, muted navy blue background (`#0c1527`) and dark navy cards (`#142038`) as Caregiver night mode.
- **Preserved Jewel Accents**: Game icons (rose, amber, emerald, sky blue, teal, violet) maintain their vibrant, reassuring colors across both light and dark modes.
- **Accessibility Controls**: Senior-friendly text size scaling (`Standard`, `Large`, `Extra Large`), high-contrast borders, and reduced motion settings.

### 2. Complete 8 Playable Cognitive Games
All 8 games are genuinely playable with no placeholder cards:
1. **Memory Match**: Comforting icon pairs (warm tea, garden rose, morning bird, sunshine) with large accessible text labels and moves counter.
2. **Sequence Memory**: Simon-style peaceful bell chimes with Web Audio synth, non-punitive pattern playback, and a **Replay Pattern** button.
3. **Image Recognition**: "Memory Basket" observation phase followed by recognition lineup with gentle reassurance.
4. **Garden Maze**: 2D labyrinth navigable via keyboard arrow keys (or WASD) **and** large on-screen touch directional buttons.
5. **Word Scramble**: Unscramble letters into meaningful words with Easy, Medium, and Hard vocabulary lists, shuffle, and hint system.
6. **Word Search & Circle Words**: Locate hidden words in a letter grid across horizontal, vertical, and diagonal directions with interactive drag/click selection and progress tracking.
7. **Test Tube Colour Matching**: Playable water/bead sorting puzzle with 3–4 test tubes. Includes distinct geometric icons (Drop, Leaf, Sun, Star) alongside colors to guarantee color-blind accessibility, plus an Undo button.
8. **Jigsaw Picture Puzzle**: Scenic puzzle with adjustable piece counts (2×2 for Gentle, 3×3 for Regular) and click-to-swap mechanics with reference picture guide.

### 3. Four User Modes (Phase 8)
- **General**: Balanced cognitive exercises, gentle puzzles, and mindful relaxation.
- **Memory-Friendly**: Shorter instructions, generous hints, familiar everyday items, and slower pacing.
- **Calm & Relax**: Zero time pressure, ambient audio emphasis, breathing exercises.
- **Focus & Brain Training**: Structured attention, pattern recall, and gradual challenges.

### 4. Multilingual Support — All 13 Requested Languages (Phase 9)
Full structured localization dictionaries for:
1. English (`en`)
2. Assamese (`as` / অসমীয়া)
3. Meitei / Manipuri (`mni` / ꯃꯩꯇꯩꯂꯣꯟ)
4. Bodo (`brx` / बर')
5. Mizo (`lus` / Mizo ṭawng)
6. Khasi (`kha` / Ka Ktien Khasi)
7. Garo (`grt` / A·chik)
8. Kokborok (`trp` / Kokborok)
9. Hindi (`hi` / हिन्दी)
10. Tamil (`ta` / தமிழ்)
11. Telugu (`te` / తెలుగు)
12. Kannada (`kn` / ಕನ್ನಡ)
13. Malayalam (`ml` / മലയാളം)

*Voice Fix Verified*: Selecting Tamil or regional languages immediately pairs with the matching Web Speech voice (`ta-IN`, `hi-IN`, etc.). If an offline speech voice is not installed on the user's browser, a clear disclosure banner is displayed offering written instructions and an optional English spoken fallback rather than silently speaking English.

### 5. Web Speech API & Web Audio Synthesizer (Phases 10 & 11)
- **Voice Guidance**: Dedicated "Listen" button on every activity, female-preferred voice option, speech rate (0.7x to 1.2x), and volume control.
- **Ambient Soundscapes**: Built-in Web Audio API synthesizer generates Alpha waves (10 Hz), Theta waves (6 Hz), ocean tides, and garden chimes without external audio files.
- **Audio Ducking**: Soundscapes automatically duck to 15% volume while voice guidance is reading, then smoothly fade back up.

### 6. Memory Garden & Real-Time Achievements (Phase 12)
- **Interactive Garden Canvas**: Dynamically evolves across 4 stages (*Fresh Sprout* → *Budding Blossom* → *Flourishing Flora* → *Lush Sanctuary*) based on genuine completed activity counts.
- **Dynamic Achievements**: Recalculated from actual gameplay history, resolving the "Still Growing" bug.

### 7. Active Session Timers & Break Reminders (Phase 13)
- Real active play timer using `document.visibilityState` to avoid counting idle background tabs.
- Configurable thresholds (defaults: 18m check-in, 30m break suggestion, 45m extended session pause).
- Warm, non-punitive break dialogue with a direct shortcut to 4-7-8 deep breathing.

### 8. Caregiver Dashboard (Phase 14)
- Live Session Status indicator (Green / Yellow / Red).
- Configurable break and check-in sliders.
- Remote patient mode recommendation.
- Comprehensive activity history table with dates, durations, and scores.
- Supportive caregiver observation notes log.

### 9. Strict Password Security (Phase 5)
Shared validation function enforcing all 5 security requirements:
1. Minimum 8 characters.
2. At least one uppercase letter (A-Z).
3. At least one lowercase letter (a-z).
4. At least one number (0-9).
5. At least one special character (!@#$%^&*).
Live interactive checklist displayed on Registration, Password Reset, and Change Password.

### 10. Help Desk & Honest Support Integration (Phase 15)
- Comprehensive categorized FAQs.
- Configurable contact parameters: Support email, phone, and hours clearly identified for deployment configuration.
- Local prototype ticket logging with clear disclosure.

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Development Server
```powershell
# Navigate to the project directory
cd "C:\Users\Adithya Somasundaram\.gemini\antigravity-ide\scratch\mindmate"

# Install dependencies (already completed)
npm install

# Start the Vite development server
npm run dev -- --host 127.0.0.1 --port 5173

# Build for production
npm run build
```

---

## 🔒 Security & Deployment Architecture

| Feature | Prototype Implementation | Production Integration Required |
|---|---|---|
| **Authentication** | Client session state + demo accounts | Server-side password hashing (bcrypt/argon2), JWT/httpOnly cookie sessions |
| **Password Recovery** | Honest simulated 6-digit verification code | Secure SMTP email service (SendGrid, AWS SES) with time-limited tokens |
| **Data Persistence** | Browser LocalStorage with safe JSON parsing | HIPAA/FHIR-compliant encrypted PostgreSQL/MongoDB database |
| **Speech Voices** | Browser Web Speech API (`SpeechSynthesis`) | Optional Cloud TTS (Google Cloud TTS / Azure Speech) for low-resource languages |
| **Help Desk** | LocalStorage ticket registry | Zendesk API, Freshdesk, or direct email webhook |

---

## 🧪 Acceptance Tests Summary

- [x] Application compiles cleanly via `npm run build` with 0 errors.
- [x] HTTP dev server serves on port 5173 with status 200.
- [x] All 10 games have complete, playable mechanics, restart controls, and audio instruction buttons.
- [x] Patient night mode matches Caregiver night mode (`#0c1527` base, `#142038` card surfaces).
- [x] All 13 languages have complete structured locale files.
- [x] Password validation enforces all 5 rules across register, reset, and settings.
- [x] Memory Garden accurately reflects activity history count.
- [x] Break reminder modal displays at configurable thresholds.
