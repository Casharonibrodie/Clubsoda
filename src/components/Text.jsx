import { useReflow } from '@react-three/flex'
import { Text as TextImpl } from '@react-three/drei'
import PropTypes from 'prop-types'

function Text({ bold = false, anchorX = 'left', anchorY = 'top', textAlign = 'left', ...props }) {
  const reflow = useReflow()
  const font = bold ? '/Inter-Bold.woff' : '/Inter-Regular.woff'
  return (
    <TextImpl
      anchorX={anchorX}
      anchorY={anchorY}
      textAlign={textAlign}
      font={font}
      onSync={reflow}
      {...props}
    />
  )
}

Text.propTypes = {
  bold: PropTypes.bool,
  // You can restrict anchorX to one of the accepted strings
  anchorX: PropTypes.oneOf(['left', 'center', 'right']),
  // You can restrict anchorY similarly (adjust based on your use case)
  anchorY: PropTypes.oneOf(['top', 'middle', 'bottom']),
  // Restrict textAlign to the accepted values
  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
  // Any other props you expect can also be validated here.
}

export default Text
