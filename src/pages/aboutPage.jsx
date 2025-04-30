
import { useEffect, useState} from "react";
import { Link} from 'react-router-dom';
import parse from "html-react-parser";
import Footer from "../components/footer/footer";
import '../styles/about-page.css';
import MainHeader from "../components/Header/mainHeader";

function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    fetch("https://clubsoda.io/wp-backend/wp-json/wp/v2/pages/16")
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
    <>
    <div className="about-page">

        {/* About Section 1 */}
        <div className="about-hero-section">
            <video
            src="https://clubsoda.io/wp-backend/wp-content/uploads/2025/02/Emitter.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            ></video>
            <MainHeader 
            sectionTitle={parse(acf.about_section_banner.section_banner_text)}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            />
            <div className={`nav-open-content ${menuOpen ? "hidden" : ""}`}>
                    <div className="about-section-1-content">
                        <span>Brought to you by
                            <a className="swing mcintosh" href="https://www.mcintoshbros.com/" target="_blank">
                                McIntosh
                            </a>
                        </span>
                    </div>
            </div>
        </div>

        <div className={`nav-open-content ${menuOpen ? "hidden" : ""}`}>

        {/* About Section 2 */}
        <div className="about-section-2">
            <div className="about-section-2-content">
                <h2>The <span className="grey-color-text">yin</span> to your <span className="grey-color-text">yang</span>:<br/>
                Multiple touchpoints for brands and creators</h2>
            </div>
        </div>

        {/* About Section 3 */}
        <div className="about-section-3">
            <div className="about-section-3-content">
           <h2> At<img src="https://clubsoda.io/wp-backend/wp-content/uploads/2025/01/clubsoda-footer-logo.png"></img> , we&apos;re more than an agency — we&apos;re a <span className="grey-color-text">collective network</span> of creatives and critical thinkers, Bridging brands and creative minds to deliver products that turn heads. Whether you’re an individual <span className="grey-color-text">creator</span>, a <span className="grey-color-text">startup</span> with big ideas, or an established <span className="grey-color-text">brand</span> looking for a fresh spark, we&apos;ll make your brand pop like bubble wrap — but way more satisfying.</h2>
            </div>
        </div>


        {/* About Section 4 */}
        <div className="about-section-4">
            <div className="about-section-content-right">
            {parse(acf.about_section_3.section_3_experience)}
            </div>
            <div className="about-image-right">
                {acf.about_section_3.section_3_images_1.map((imageUrl, index) => (
                <div className="about-section-image" key={index}>
                    <img src={imageUrl} alt={`About Section Image ${index + 1}`} />
                </div>
                ))}
            </div>
            <div className="about-section-content-left">
            {parse(acf.about_section_3.section_3_products)}
            </div>
            <div className="about-image-left">
                {acf.about_section_3.section_3_images_2.map((imageUrl, index) => (
                <div className="about-section-image" key={index}>
                    <img src={imageUrl} alt={`About Section Image ${index + 1}`} />
                </div>
                ))}
            </div>
            <div className="about-section-content-right">
            {parse(acf.about_section_3.section_3_awards)}
            </div>
            <div className="about-image-right">
                {acf.about_section_3.section_3_images_3.map((imageUrl, index) => (
                <div className="about-section-image last-about-section-image" key={index}>
                    <img src={imageUrl} alt={`About Section Image ${index + 1}`} />
                </div>
                ))}
            </div>
        </div>

        {/* About Section 5 */}
        <div className="about-section-solution">
            <div className="about-solution-wrapper">
                <div className="about-solution-heading">
                    <h2>{parse(acf.about_section_4.solutions)}</h2>
                </div>
                {acf.about_section_4.solutions_list.map((solution, index) => (
                <div className="about-solution-content" key={index}>
                    <span>
                        <h3>{parse(solution.solution_title)}</h3>
                    </span>
                    <span>
                        <p>{parse(solution.solution_description)}</p>
                    </span>
                </div>
                ))}
            </div>
        </div>


        {/* About Section 6 */}
        <div className="about-gallery padding">
            <h2>{parse(acf.about_section_5.section_5_title_1)}</h2>
            <div className="about-logo-section">
                {acf.about_section_5.section_5_images_1.map((imageUrl, index) => (
                    <img key={index} src={imageUrl} alt={`Logo ${index + 1}`} />
                ))}
            </div>
            <h2 className="right">{parse(acf.about_section_5.section_5_title_2)}</h2>
            <div className="about-logo-section">
                {acf.about_section_5.section_5_image_2.map((imageUrl, index) => (
                    <img key={index} src={imageUrl} alt={`Logo ${index + 1}`} />
                ))}
            </div>
        </div>

        {/* About Section 7 */}
        <div className="perception padding">
            <div className="two-column">
                <div className="img-section">
                    <img
                    src={acf.about_section_6.section_6_image.url}
                    alt={acf.about_section_6.section_6_image.alt || "Perception Image"}
                    />
                </div>
                <div>
                    <h4>{parse(acf.about_section_6.section_6_perception_title)}</h4>
                    <p>{parse(acf.about_section_6.section_6_perception_subtitle)}</p>
                </div>
            </div>
        </div>


        {/* About Section 8 */}
        <div className="white about-contact high-padding">   
            <div className="content-width">
                <p>{parse(acf.about_section_7.section_7_title)}</p>
                <Link className="white-button" to="/contact" >CONTACT US</Link>
            </div>
        </div> 
        </div>
    <Footer/>
</div>  
    </>
  );
}

export default AboutPage;
