import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Contact } from './pages/Contact';

function AppShell() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Header />
        <div className="flex-1" key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
