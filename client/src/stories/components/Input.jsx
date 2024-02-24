import React from 'react'
import PropTypes from 'prop-types'
import { CFormInput, CFormTextarea } from '@coreui/react'

export const Input = ({ textarea, ...props }) => {
  const Component = textarea ? CFormTextarea : CFormInput

  return (
    <Component
      {...props}
      //   text="Must be 8-20 characters long."
      // size="lg"
      style={{ borderRadius: '0' }}
      aria-describedby="exampleFormControlInputHelpInline"
    />
  )
}



Input.propTypes = {
  /**
   * عنوان البطاقة
   */
  label: PropTypes.string,
  /**
   * What background color to use
   */
  placeholder: PropTypes.string,
  /**
   * How large should the button be?
   */
  textarea: PropTypes.bool,
  /**
   * Button contents
   */
  type: PropTypes.string,
}

Input.defaultProps = {
  // label: 'Email Address',
  placeholder: 'عدد التخصصات #7',
  textarea: false,
  type: 'email',
}
