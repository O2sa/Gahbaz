import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCol,
  CModal,
  CRow,
  CModalHeader,
  CCardTitle,
  CCardImage,
  CModalBody,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Button } from './button'
import { Link, useNavigate } from 'react-router-dom'
export default function Model({
  modelBody,
  title,
  visible,
  setVisible,
  variant,
  handleSubmit,
  to,
  ...props

}) {
  const [show, setShow] = useState(true)
const navigate=useNavigate()
  return (
    <>
      <CModal
        size={variant === 'form' ? 'xl' : null}
        scrollable
        
        visible={visible ?? show}
        backdrop="static"
        alignment={variant === 'form' ? null : 'center'}
        // style={variant === 'form' ? {width: '77vw'} : 'center'}
        // onClick={() => {
        //   return setVisible(false)
        // }}
        onClose={()=> navigate(to)}
        aria-labelledby="ScrollingLongContentExampleLabel2"
        {...props}
      >
        <CModalHeader>
          <CModalTitle id="ScrollingLongContentExampleLabel2">{title}</CModalTitle>
        </CModalHeader>
        <CModalBody className={`mt-4 ${variant === 'form' ? 'vh-100' : null}`}>
          {modelBody}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="light"
            onClick={() => {
              return setVisible ? setVisible(false) : setShow(false)
            }}
          >
            إغلاق
          </CButton>
          {/* <Link to={'..'}> */}
            <CButton
              onClick={() => {
                setVisible ? setVisible(false) : setShow(false)
                return handleSubmit()
              }}
              color="primary"
            >
              حفظ التغيرات
            </CButton>
          {/* </Link> */}
        </CModalFooter>
      </CModal>
    </>
  )
}

Model.propTypes = {
  title: PropTypes.string,
  modelBody: PropTypes.object,
  v: PropTypes.bool,
  setVisible: PropTypes.func,
  variant: PropTypes.oneOf(['warning', 'form']),
  handleSubmit: PropTypes.func,
}
