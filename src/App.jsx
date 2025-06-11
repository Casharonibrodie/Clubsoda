import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';


import LandingPage from "./pages/landingPage";
import AboutPage from "./pages/aboutPage";
import ServicePage from "./pages/servicePage";
import RecruitPage from "./pages/recruitPage/recruitPage";
import RecruitPageForm from "./pages/recruitPage/recruitPageForm";
import ContactPage from "./pages/contactPage/contactPage";
import ContactPageForm from "./pages/contactPage/contactPageForm";
import ComingSoon from "./pages/coming-soon";
import SubmissionConfirmation from "./pages/formSubmission";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=6LehflcrAAAAALzObdaTRymWjWX94BU_ot7l_opf"; // ← your v3 site key
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services/:serviceSlug" element={<ServicePage />} />
        <Route path="/recruit" element={<RecruitPage />} />
        <Route path="/recruit/form" element={<RecruitPageForm />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact/form" element={<ContactPageForm />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/submission-confirmation" element={<SubmissionConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
