import PropTypes from 'prop-types';
import './button.css';

function Button({ text, onClick, color}) {
  return (
    <button
      className='cta-button'
      onClick={onClick}
      style={{ color }}
    >
      {text}
    </button>
  );
}

Button.defaultProps = {
  text: "Click Me",
  onClick: () => {},
  color: "#000", 
};

// Define prop types
Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,     
  color: PropTypes.string,     
};

export default Button;
