import PropTypes from 'prop-types'
import { CButton, CFormTextarea } from '@coreui/react'
import { Button } from '../components/button'
import icon from '../assets/editIcon_2.svg'

import React, { useState } from 'react'
// import EditPopover from './EditPopover'; // Import your EditPopover component

// export default EditButtonWithPopover;

export const TabsBody = ({ title, label, handle, addModel, opt, itemData, ...props }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen)
  }
  const Model = addModel
  return (
    <div
      className={`d-flex w-100 justify-content-between bg-white align-items-center p-3 mb-2 border-bottom`}
    >
      <h5>{title} </h5>
      <CButton onClick={togglePopover} className="bg-primary bg-opacity-25 text-primary border-0">
        {label}
      </CButton>
      {isPopoverOpen && (
        <Model
          itemData={itemData ? itemData : null}
          opt={opt ? opt : null}
          onClose={togglePopover}
        />
      )}{' '}
      {/* Render the popover/modal */}
    </div>
  )
}

TabsBody.propTypes = {
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

TabsBody.defaultProps = {
  label: 'Email Address',
  placeholder: 'عدد التخصصات #7',
  textarea: false,
  type: 'email',
}
