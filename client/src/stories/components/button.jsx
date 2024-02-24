import React from 'react'
import PropTypes from 'prop-types'
import { CButton, CCardImage } from '@coreui/react'
/**
 * Primary UI component for user interaction
 */
export const Button = ({ label, icon, ...props }) => {
  //   const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary'
  return (
    <CButton
      type="button"
      //   className={`btn`}
      //   style={backgroundColor && { backgroundColor }}
    // className={icon && 'bg-primary bg-opacity-10'}
      {...props}
    >
      {icon && <CCardImage className="m-2 text-primary" style={{ width: '24px' }} src={icon} />}
      {label}
    </CButton>
  )
}

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  color: PropTypes.oneOf(['primary', 'outline', 'success']),
  /**
   * What background color to use
   */
  variant: PropTypes.oneOf(['', 'outline', 'ghost']),
  /**
   * How large should the button be?
   */
  // size: PropTypes.oneOf(['sm', 'lg']),
  /**
   * Button contents
   */
  label: PropTypes.string,
  icon: PropTypes.object,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  shape: PropTypes.string,
}

Button.defaultProps = {
  color: 'primary',
  // size: 'lg',
  onClick: undefined,
  label: 'Button',
  variant: '',
  shape: 'rounded-0',
  icon: null,
}
