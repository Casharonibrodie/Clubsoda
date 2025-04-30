import { useEffect, useState } from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import { CREDENTIALS } from '../../utils/credentials';

function Footer() {
  const [menuData, setMenuData] = useState([]);
  const [secondaryMenuData, setSecondaryMenuData] = useState([]);

  const decodeHTMLEntities = (str) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      const { username, password } = CREDENTIALS;
      const base64credentials = btoa(`${username}:${password}`);
      try {
        // Fetch primary menu data
        const primaryResponse = await fetch(
          "https://clubsoda.io/wp-backend/wp-json/wp/v2/menu-items?menus=7&_fields=id,title,url,parent",
          {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${base64credentials}`,
            },
          }
        );
        if (primaryResponse.ok) {
          const primaryData = await primaryResponse.json();
          setMenuData(primaryData);
        } else {
          console.error("Failed to fetch primary menu data");
        }
        // Fetch secondary menu data
        const secondaryResponse = await fetch(
          "https://clubsoda.io/wp-backend/wp-json/wp/v2/menu-items?menus=6&_fields=id,title,url,parent",
          {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${base64credentials}`,
            },
          }
        );

        if (secondaryResponse.ok) {
          const secondaryData = await secondaryResponse.json();
          setSecondaryMenuData(secondaryData);
        } else {
          console.error("Failed to fetch secondary menu data");
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, []);

  const getChildren = (menuItems, parentId) => {
    return menuItems.filter((item) => item.parent === parentId);
  };

  const topLevelMenus = secondaryMenuData.filter((item) => item.parent === 0);

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
  

  return (
    <footer>
      <div className="footer-content high-padding">
        <div className="container">
          <div className="footer-links-section">
            {topLevelMenus.map((menu) => (
              <div key={menu.id}>
                <Link to={`/?outerMenuSlug=${generateSlug(menu.title.rendered)}`}>
                  <h6>{decodeHTMLEntities(menu.title.rendered)}</h6>
                </Link>
                <ul>
                  {getChildren(secondaryMenuData, menu.id).map((child) => {
                    const childSlug = generateSlug(child.title.rendered);
                    let childLink = `/?outerMenuSlug=${generateSlug(menu.title.rendered)}&innerMenuSlug=${childSlug}`;

                    if (childSlug === "vtuber_creation") {
                      childLink = "/services/vtuber_builder";
                    } else if (childSlug === "digital_advertising") {
                      childLink = "/services/digital_advertising";
                    } else if (childSlug === "for_brands_coming_soon") {
                      childLink = "/coming-soon";
                    }

                    return (
                      <li key={child.id}>
                        <Link to={childLink}>
                          {decodeHTMLEntities(child.title.rendered)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-logo">
        <div className="container">
          <img
            src="https://clubsoda.io/wp-backend/wp-content/uploads/2025/01/clubsoda-footer-logo.png"
            alt="Clubsoda Logo"
          />
        </div>
      </div>
      <div className="footer-bottom padding">
        <div className="container">
          <div className="footer-bottom-menu">
            <div>
              <h6>Menu</h6>
              <ul>
                {getChildren(menuData, menuData.find((item) => item.title.rendered === "MENU")?.id || 0).map((item) => (
                  <li key={item.id}>
                    <Link to={`/${item.title.rendered.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")}`}>
                        {item.title.rendered}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hiddenForNow">
              <h6>Legal Bits</h6>
              <ul>
                {getChildren(menuData, menuData.find((item) => item.title.rendered === "LEGAL BITS")?.id || 0).map((item) => (
                  <li key={item.id}>
                    <a href={item.url}>{decodeHTMLEntities(item.title.rendered)}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="copy-right">© Clubsoda 2025</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
