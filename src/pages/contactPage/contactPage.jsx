import '../../styles/contact-page.css';
import { useState, useEffect} from 'react';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import Button from '../../components/button/button';
import MainHeader from '../../components/Header/mainHeader';

function ContactPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch("https://doctest.a2hosted.com/clubsoda/wp-backend/wp-json/wp/v2/pages/192")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div></div>;
  }

  if (!data) {
    return <div>Error loading data</div>;
  }

  const acf = data.acf;

  return (
    <div className="contact-background">
      <video
        src="https://doctest.a2hosted.com/clubsoda/wp-backend/wp-content/uploads/2025/02/Gradientwavyballs.mp4"
        autoPlay
        muted
        loop
        playsInline
      ></video>
      <MainHeader
        sectionTitle={parse(acf.contact_header.contact_banner_text)}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <div className={`contact-main-content nav-open-content ${menuOpen ? "hidden" : ""}`}>

        {isMobile ? (
          <h1 className="main-heading">{parse(acf.contact_header.contact_banner_text)}</h1>
        ) : (
          <h1 className="main-heading">{parse(acf.contact_section_1.contact_section_title)}</h1>
        )}
        <Link to="/contact/form">
          <Button text="Get Started" color="#084C84" />
        </Link>
        <p className="contact-content-line1">{parse(acf.contact_section_1.contact_section_message)}</p>
        <p className="contact-content-line2">{parse(acf.contact_section_1.contact_section_message_2)}</p>
      </div>
    </div>
  );
}

export default ContactPage;
