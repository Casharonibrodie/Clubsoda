import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import parse from "html-react-parser";
import Footer from "../components/footer/footer";
import "../styles/service-page.css";
import ServiceHeader from "../components/Header/serviceHeader";

gsap.registerPlugin(ScrollTrigger);

function ServicePage() {
  const { serviceSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://clubsoda.io/wp-backend/wp-json/wp/v2/pages/77"
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

  useEffect(() => {
    window.addEventListener("load", ScrollTrigger.refresh);
    return () => window.removeEventListener("load", ScrollTrigger.refresh);
  }, []);

  useEffect(() => {
    if (!data || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { clipPath: "circle(0% at 50% 50%)" },
        {
          clipPath: "circle(150% at 50% 50%)",
          duration: 2,
          scrollTrigger: {
            trigger: overlayRef.current,
            start: "top center",
            end: "bottom top",
            scrub: 1,
          },
          ease: "power2.out",
        }
      );
    });
    return () => ctx.revert();
  }, [data]);

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

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\/+/g, "")
      .replace(/&/g, "_&_")
      .replace(/[-]+/g, "_")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/[^a-z0-9_&]+/g, "");
  };

  let formattedServiceSlug = `services_section_${generateSlug(serviceSlug)}`;
  console.log("Formatted Service Slug:", formattedServiceSlug);

  let service = acf[formattedServiceSlug] || null;

  if (!service) {
    console.log(`Service Not Found for: ${formattedServiceSlug}`);

    const possibleMatches = Object.keys(acf).filter((key) =>
      key.includes(`services_section_${serviceSlug.replace(/-/g, "_")}`)
    );

    console.log("Possible Matches Found:", possibleMatches);

    const exactMatch = possibleMatches.find(
      (key) => key === formattedServiceSlug
    );

    if (exactMatch) {
      formattedServiceSlug = exactMatch;
    } else if (possibleMatches.length > 0) {
      formattedServiceSlug =
        possibleMatches.find(
          (key) => key === `services_section_${serviceSlug}`
        ) || possibleMatches[0]; 
    }

    service = acf[formattedServiceSlug];
    console.log(`Using closest match: ${formattedServiceSlug}`);
  }

  const specialRedirectServices = [
    "live_streamer",
    "vtuber",
    "content_creator",
  ];
  console.log("Checking ACF for:", formattedServiceSlug);
  console.log("ACF Keys Available:", Object.keys(acf));
  console.log("ACF Data for Key:", acf[formattedServiceSlug] || "NOT FOUND");

  if (!service) {
    return <div className="error-message">Service not found</div>;
  }

  return (
    <>
      <div className="services-page-container">
        <div className="service-header-wrapper">
          <div className="service-header padding white">
            <ServiceHeader
              serviceButton={parse(
                acf.services_section_1.connect_with_us || ""
              )}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
            />
          </div>
        </div>
        <div className="service-framer-wrapper">
          <div className="service-framer padding white">
            <div className="two-column">
              <div className="img-section">
                <video
                  src="https://clubsoda.io/wp-backend/wp-content/uploads/2025/03/Metaball-3.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                ></video>
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
                    Object.values(
                      service[`${formattedServiceSlug}_features`]
                    ).map((feature, index) =>
                      feature ? <li key={index}>{parse(feature)}</li> : null
                    )}
                </ul>

                <Link
                  className="violet-border-button button left color-icon"
                  to={
                    specialRedirectServices.includes(serviceSlug)
                      ? "/recruit"
                      : decodeURIComponent(service.get_in_touch || "/contact")
                  }
                >
                  Get in touch <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="join-club-wrapper">
          <div className="join-club white high-padding" ref={overlayRef}>
            <video
              src="https://clubsoda.io/wp-backend/wp-content/uploads/2025/03/Big-circle.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="background-video"
            />
            <div className="content-width">
              <h2>
                {parse(acf.services_section_2.services_section_2_title || "")}
              </h2>
              <Link
                className="violet-border-button button"
                to={decodeURIComponent(
                  acf.services_section_2.contact_us || "/contact"
                )}
              >
                CONTACT US<i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          <div className="join-club-overlay"></div>
        </div>
        <Footer />
      </div>
    </>
  );
}
export default ServicePage;
