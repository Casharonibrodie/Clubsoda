import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import gsap from "gsap";
import { CREDENTIALS } from "../../utils/credentials";

function MobileHeader({ menuOpen, setMenuOpen }) {
    const mobileMenuRef = useRef(null);
    const bottomLogoRef = useRef(null);
    const [menuItems, setMenuItems] = useState([]);
    const [isClosing, setIsClosing] = useState(false);

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
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [menuOpen]);

    useEffect(() => {
        if (menuOpen && menuItems.length > 0) {
            gsap.set(mobileMenuRef.current, { display: "block", opacity: 0, y: 20 });
            gsap.set(bottomLogoRef.current, { opacity: 0, y: 20 });
    
            gsap.timeline()
                .to(mobileMenuRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
                .fromTo(
                    "li",
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
                    "-=0.3"
                )
                .to(
                    bottomLogoRef.current,
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                    0.1 
                );
        } else if (!menuOpen && mobileMenuRef.current) {
            setIsClosing(true);
    
            gsap.timeline()
                .to("li", { opacity: 0, y: 20, duration: 0.2, stagger: -0.05 })
                .to(bottomLogoRef.current, { opacity: 0, y: 20, duration: 0.2 }, "-=0.15") 
                .to(
                    mobileMenuRef.current,
                    {
                        opacity: 0,
                        y: 20,
                        duration: 0.4,
                        ease: "power2.in",
                        onComplete: () => {
                            setIsClosing(false);
                            setMenuOpen(false);
                            gsap.set(mobileMenuRef.current, { display: "none" });
                        },
                    }
                );
        }
    }, [menuOpen, menuItems]);
    
    

    return (
        <div className="mobile-header">
            <Link to="/">
                <img
                    className="mobile-header-logo"
                    src="https://clubsoda.io/wp-backend/wp-content/uploads/2025/01/perception-image.png"
                    alt="Logo"
                />
            </Link>
            <div>
                <div
                    className={`nav-icon4 ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {(menuOpen || isClosing) && (
                    <div
                        className={`mobile-menu-container ${menuOpen ? "open" : "closed"}`}
                        ref={mobileMenuRef}
                    >
                        <ul className="list-unstyled">
                            {menuItems.length > 0 ? (
                                menuItems.map((item) => (
                                    <li key={item.id}>
                                        <Link to={`/${item.title.rendered.toLowerCase()}`} role="button">
                                            {item.title.rendered}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>No menu items available</li>
                            )}
                        </ul>
                        <img
                            className="mobile-bottom-logo"
                            ref={bottomLogoRef}
                            src="https://clubsoda.io/wp-backend/wp-content/uploads/2025/01/clubsoda-footer-logo.png"
                            alt="Footer Logo"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

MobileHeader.propTypes = {
    menuOpen: PropTypes.bool.isRequired,
    setMenuOpen: PropTypes.func.isRequired,
};

export default MobileHeader;
