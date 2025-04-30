import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MobileHeader from "./mobileHeader";

function ServiceHeader({serviceButton, menuOpen, setMenuOpen }){
    return(
        <>
        <div className="two-column">
            <div className="img-section">
              <Link to="/">
                <img src="https://clubsoda.io/wp-backend/wp-content/uploads/2025/01/perception-image.png" alt="Logo" />
              </Link>
            </div>
            <div>
              <Link className="underline-button button right" to="/contact">
                {serviceButton}
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          <MobileHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </>
    )
}

ServiceHeader.propTypes = {
    serviceButton: PropTypes.string.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    setMenuOpen: PropTypes.func.isRequired,
};

export default ServiceHeader