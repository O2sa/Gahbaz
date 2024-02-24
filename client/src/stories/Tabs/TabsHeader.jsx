import React from 'react'
import PropTypes from 'prop-types'
import { CFormTextarea } from '@coreui/react'

export const TabsHeader = ({ textarea, ...props }) => {

  return (
    <div></div>
     
  )
}

TabsHeader.propTypes = {
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

TabsHeader.defaultProps = {
  label: 'Email Address',
  placeholder: 'عدد التخصصات #7',
  textarea: false,
  type: 'email',
}
