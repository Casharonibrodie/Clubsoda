import '../../styles/recruit-page.css';
import gsap from 'gsap';
import { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import Button from '../../components/button/button';
import MainHeader from '../../components/Header/mainHeader';

function RecruitPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinksRef = useRef([]);

  useEffect(() => {
    fetch("https://doctest.a2hosted.com/clubsoda/wp-backend/wp-json/wp/v2/pages/173")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [])

  useEffect(() => {
    if (data && navLinksRef.current.length > 0) {
      let ctx = gsap.context(() => {
        gsap.fromTo(
          navLinksRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, delay: 0.1, duration: 0.5, stagger: 0.2, ease: 'easeIn' }
        );
      }, navLinksRef);
      return () => ctx.revert();
    }
  }, [data]);

  if (loading) {
    return <div></div>;
  }

  if (!data) {
    return <div>Error loading data</div>;
  }

  const acf = data.acf;

  return (
    <>
      <div className="recruit-background">
      <video
        src="https://doctest.a2hosted.com/clubsoda/wp-backend/wp-content/uploads/2025/01/red-balls.mp4"
        autoPlay
        muted
        loop
        playsInline
      ></video>
        <MainHeader 
        sectionTitle={parse(acf.recruit_header.recruit_banner_text)}            
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        />

        <div className={`recruit-main-content nav-open-content ${menuOpen ? "hidden" : ""}`}>
          <h1 className="main-heading">{parse(acf.recruit_section_1.section_1_title)}</h1>
          <Link to={"/recruit/form"}>
            <Button text='Get Started' color='#D03820'/>
          </Link>
          <p className="recruit-content-line1">{parse(acf.recruit_section_1.section_1_message)}</p>
          <p className="recruit-content-line2">{parse(acf.recruit_section_1.section_1_message_2)}</p>
        </div>
      </div>
    </>
  );
}

export default RecruitPage;
