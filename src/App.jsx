import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { AudioProvider } from './contexts/AudioContext';
import { ActivityProvider } from './contexts/ActivityContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VoiceNoticeBanner from './components/VoiceNoticeBanner';
import BreakReminderModal from './components/BreakReminderModal';
import LogoutModal from './components/LogoutModal';
import CornerThemeSelector from './components/CornerThemeSelector';
import AmbientGlow from './components/AmbientGlow';

import LandingPage from './pages/LandingPage';
import PatientDashboard from './pages/PatientDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import GamesCatalog from './pages/GamesCatalog';
import MemoryGarden from './pages/MemoryGarden';
import RelaxationHub from './pages/RelaxationHub';
import HelpDesk from './pages/HelpDesk';
import SettingsPage from './pages/SettingsPage';
import AuthPages from './pages/AuthPages';

// 8 Cognitive Games
import MemoryMatch from './games/MemoryMatch';
import SequenceMemory from './games/SequenceMemory';
import ImageRecognition from './games/ImageRecognition';
import Maze from './games/Maze';
import TestTubeColor from './games/TestTubeColor';
import JigsawPuzzle from './games/JigsawPuzzle';
import WordScramble from './games/WordScramble';
import WordSearch from './games/WordSearch';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <UserModeProvider>
            <AudioProvider>
              <ActivityProvider>
                <BrowserRouter>
                  <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0c1527] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative selection:bg-teal-500 selection:text-white">
                    <AmbientGlow />
                    <VoiceNoticeBanner />
                    <Navbar />
                    <BreakReminderModal />
                    <LogoutModal />
                    <CornerThemeSelector />
                    
                    <main className="flex-1 relative z-10">
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/patient" element={<PatientDashboard />} />
                        <Route path="/caregiver" element={<CaregiverDashboard />} />
                        <Route path="/games" element={<GamesCatalog />} />
                        
                        {/* 8 Playable Games */}
                        <Route path="/games/memory-match" element={<MemoryMatch />} />
                        <Route path="/games/sequence-memory" element={<SequenceMemory />} />
                        <Route path="/games/image-recognition" element={<ImageRecognition />} />
                        <Route path="/games/maze" element={<Maze />} />
                        <Route path="/games/word-scramble" element={<WordScramble />} />
                        <Route path="/games/word-search" element={<WordSearch />} />
                        <Route path="/games/test-tube-color" element={<TestTubeColor />} />
                        <Route path="/games/jigsaw-puzzle" element={<JigsawPuzzle />} />

                        <Route path="/garden" element={<MemoryGarden />} />
                        <Route path="/relaxation" element={<RelaxationHub />} />
                        <Route path="/help" element={<HelpDesk />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        
                        {/* Auth Routes */}
                        <Route path="/auth" element={<AuthPages />} />
                        <Route path="/login" element={<AuthPages />} />
                        <Route path="/register" element={<AuthPages />} />
                        <Route path="/forgot-password" element={<AuthPages />} />
                        <Route path="/reset-password" element={<AuthPages />} />
                        
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>

                    <Footer />
                  </div>
                </BrowserRouter>
              </ActivityProvider>
            </AudioProvider>
          </UserModeProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
