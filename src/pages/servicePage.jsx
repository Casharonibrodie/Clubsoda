import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import Footer from "../components/footer/footer";
import "../styles/service-page.css";
import ServiceHeader from "../components/Header/serviceHeader";

function ServicePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("https://doctest.a2hosted.com/clubsoda/wp-backend/wp-json/wp/v2/pages/77")
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

  const { acf } = data;

  if (!acf) {
    return <div>Error: ACF data is missing</div>;
  }

  return (
    <>
      <div className="services-page-container">
        <div className="service-header padding white">
          <ServiceHeader 
          serviceButton={parse(acf.services_section_1.connect_with_us ||'' )}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen} 
          />
        </div>
        <div className="service-framer padding white">
          <div className="two-column">
            <div className="img-section">
              <img
                src={acf.services_section_1.services_image}
                alt={acf.services_section_1.services_section_1_title || "Service Image"}
              />
            </div>
            <div>
              <h2 className="violet lower">{parse(acf.services_section_1.services_section_1_title || "")}</h2>
              <p className="upper spacing">{parse(acf.services_section_1.services_section_1_description || "")}</p>

              <ul className="list">
                {Object.values(acf.services_section_1.services_section_1_features || {}).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <Link
                className="violet-border-button button left color-icon"
                to={acf.services_section_1.get_in_touch || "/contact"}
              >
                Get in touch <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        <div
          className="join-club white high-padding"
          style={{
            backgroundImage: `url(${acf.services_section_2.section_2_background_image?.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="content-width">
            <h2>{parse(acf.services_section_2.services_section_2_title || "")}</h2>
            <Link className="violet-border-button button" to={acf.services_section_2.contact_us || "/contact"}>
              CONTACT US<i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ServicePage;
