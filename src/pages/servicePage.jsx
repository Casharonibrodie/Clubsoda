import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import Footer from "../components/footer/footer";
import "../styles/service-page.css";
import ServiceHeader from "../components/Header/serviceHeader";

function ServicePage() {
  const { serviceSlug } = useParams(); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://doctest.a2hosted.com/clubsoda/wp-backend/wp-json/wp/v2/pages/77"
        );

        if (!response.ok) throw new Error("Failed to fetch service data");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!data || !data.acf) {
    return <div className="error-message">Error: Service data is missing</div>;
  }

  const acf = data.acf;

  console.log("Available ACF Keys:", Object.keys(acf));

  let formattedServiceSlug = serviceSlug.replace(/-/g, "_");

  let service = acf[formattedServiceSlug] || null;

  if (!service) {
    console.log(`Service Not Found for: ${formattedServiceSlug}`);

    const possibleMatches = Object.keys(acf).filter((key) =>
      key.includes(serviceSlug.replace(/-/g, "_"))
    );

    console.log("Possible Matches Found:", possibleMatches);

    if (possibleMatches.length > 0) {
      formattedServiceSlug = possibleMatches[0]; 
      service = acf[formattedServiceSlug];
      console.log(`Using closest match: ${formattedServiceSlug}`);
    }
  }

  if (!service) {
    return <div className="error-message">Service not found</div>;
  }

  console.log("Loaded Service Data:", service);

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
              <h2 className="violet lower">
                {parse(service[`${formattedServiceSlug}_title`] || "Service")}
              </h2>
              <p className="upper spacing">
                {parse(service[`${formattedServiceSlug}_description`] || "")}
              </p>


<ul className="list">
  {service[`${formattedServiceSlug}_features`] &&
    Object.values(service[`${formattedServiceSlug}_features`]).map((feature, index) =>
      feature ? ( // Ensure feature is not empty/null
        <li key={index}>{parse(feature)}</li> // Parse to render HTML properly
      ) : null
    )}
</ul>


              <Link className="violet-border-button button left color-icon"
                to={decodeURIComponent(service.get_in_touch || "/contact")}
              >
                Get in touch <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="join-club white high-padding"
          style={{
            backgroundImage: `url(${acf.services_section_2.section_2_background_image?.url || "/assets/default-bg.jpg"})`,
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
