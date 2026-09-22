import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CinematicIntro } from './components/CinematicIntro';
import { IdentityGate } from './components/IdentityGate';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';
import { SecretTerminal } from './components/SecretTerminal';
import { SoundSettingsModal } from './components/SoundSettingsModal';
import { TokenHistoryDrawer } from './components/TokenHistoryDrawer';
import { CompareDrawer } from './components/CompareDrawer';
import { ToastContainer } from './components/ToastContainer';
import { HorrorAtmosphere } from './components/HorrorAtmosphere';

// Pages
import { Home } from './pages/Home';
import { Missions } from './pages/Missions';
import { MissionRunner } from './pages/MissionRunner';
import { Services } from './pages/Services';
import { CommandCenter } from './pages/CommandCenter';
import { Lair } from './pages/Lair';
import { Minions } from './pages/Minions';
import { Intelligence } from './pages/Intelligence';
import { Team } from './pages/Team';
import { Profile } from './pages/Profile';
import { Achievements } from './pages/Achievements';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

const AppContent: React.FC = () => {
  const { codename, activeMission } = useGame();
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [introCompleted, setIntroCompleted] = useState<boolean>(() => {
    // Only show intro once per session
    return sessionStorage.getItem('lord_evil_intro_seen') === 'true';
  });

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  // Show cinematic intro on first visit
  if (!introCompleted) {
    return (
      <CinematicIntro
        onComplete={() => {
          sessionStorage.setItem('lord_evil_intro_seen', 'true');
          setIntroCompleted(true);
        }}
      />
    );
  }

  // If user hasn't completed identity gate, show gate
  if (!codename) {
    return <IdentityGate onComplete={() => setCurrentRoute('home')} />;
  }

  // If a cursed mission is active, show the 20-second mission runner
  if (activeMission) {
    return <MissionRunner />;
  }

  const renderPage = () => {
    switch (currentRoute) {
      case 'home':
        return <Home onRouteChange={setCurrentRoute} />;
      case 'missions':
        return <Missions />;
      case 'services':
        return <Services />;
      case 'command-center':
        return <CommandCenter />;
      case 'lair':
        return <Lair />;
      case 'minions':
        return <Minions />;
      case 'intelligence':
        return <Intelligence />;
      case 'team':
        return <Team />;
      case 'profile':
        return <Profile />;
      case 'achievements':
        return <Achievements />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case '404':
        return <NotFound onReturn={() => setCurrentRoute('home')} />;
      default:
        return <NotFound onReturn={() => setCurrentRoute('home')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030207] text-[#FFFFFF] relative overflow-x-hidden">
      {/* Global Horror Atmosphere: Master Background, Fog, and Flying Entities */}
      <HorrorAtmosphere />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar currentRoute={currentRoute} onRouteChange={setCurrentRoute} />

        <main className="flex-1">
          {renderPage()}
        </main>

        <Footer onRouteChange={setCurrentRoute} />
      </div>

      {/* Global Overlays & Modals */}
      <CommandPalette onRouteChange={setCurrentRoute} />
      <SecretTerminal />
      <SoundSettingsModal />
      <TokenHistoryDrawer />
      <CompareDrawer onSelectService={() => setCurrentRoute('services')} />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ErrorBoundary>
  );
};

export default App;
