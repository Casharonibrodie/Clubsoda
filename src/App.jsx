import {HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import AboutPage from "./pages/aboutPage";
import ServicePage from "./pages/servicePage";
import RecruitPage from "./pages/recruitPage/recruitPage";
import RecruitPageForm from "./pages/recruitPage/recruitPageForm";
import ContactPage from "./pages/contactPage/contactPage";
import ContactPageForm from "./pages/contactPage/contactPageForm";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services/:serviceSlug" element={<ServicePage />} />
        <Route path="/recruit" element={<RecruitPage />} />
        <Route path="/recruit/form" element={<RecruitPageForm />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact/form" element={<ContactPageForm />} />
      </Routes>
    </Router>
  );
}

export default App;
