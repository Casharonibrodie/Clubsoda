import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MobileHeader from "./mobileHeader";
import gsap from "gsap";
import { CREDENTIALS } from "../../utils/credentials";

function MainHeader({ sectionTitle, menuOpen, setMenuOpen }) {
  const [menuItems, setMenuItems] = useState([]);
  const navLinksRef = useRef(null);
  const animationPlayed = useRef(false);
  const animationTimeline = useRef(null);
  useEffect(() => {
    const fetchMenuItems = async () => {
      const { username, password } = CREDENTIALS;
      const base64credentials = btoa(`${username}:${password}`);
      try {
        const response = await fetch(
          "https://clubsoda.io/wp-backend/wp-json/wp/v2/menu-items?menus=8&_fields=id,title,url,parent",
          {
            headers: {
              Authorization: `Basic ${base64credentials}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (menuItems.length > 0 && !animationPlayed.current) {
      const ctx = gsap.context(() => {
        gsap.set(".inner-nav-links li", {
          opacity: 0,
          y: 20,
        });

        animationTimeline.current = gsap.to(".inner-nav-links li", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.3,
        });
      }, navLinksRef);

      animationPlayed.current = true;

      return () => {
        if (ctx && animationTimeline.current?.progress() === 1) {
          ctx.revert();
        }
      };
    }
  }, [menuItems]);

  return (
    <div className={`inner-nav-wrapper`}>
      <div className="inner-header">
        <Link to="/">
          <img
            className="recruit-logo"
            src="https://clubsoda.io/wp-backend/wp-content/uploads/2025/01/clubsoda_logo.png"
            alt="Clubsoda Logo"
            loading="eager"
            width="140"
            height="auto"
          />
        </Link>

        <div className="about-nav-text">
          <h2>{sectionTitle}</h2>
        </div>
      </div>

      <MobileHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="inner-nav-links" ref={navLinksRef}>
        <ul className="list-unstyled">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link to={`/${item.title.rendered.toLowerCase()}`}>
                {item.title.rendered}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

MainHeader.propTypes = {
  sectionTitle: PropTypes.string.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
};

export default MainHeader;
