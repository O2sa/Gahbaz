import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CCard, CCol, CCardBody, CRow, CCardText, CCardTitle, CCardImage } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import collageIcon from '../assets/CollageIcon.svg'
import deleteIcon from '../assets/DeleteIcon.svg'
import editIcon from '../assets/EditIcon.svg'
import { cilPeople, cilUser, cilUserFemale, cilChartPie } from '@coreui/icons'
import { editingStateInitializer } from '@mui/x-data-grid/internals'
import { AddCollage } from '../screens/AddCollage'
import { AddField } from '../screens/AddField'
import { Link } from 'react-router-dom'
/**
 * Primary UI component for user interaction
 */
export const SpecialCard = ({
  title,
  subtitle,
  withDeleteIcon,
  cardIcon,
  onClick,
  onDelete,
  onEdit,
  id,
  itemData,
  editModel,
  collection
}) => {
  // const [cardEditVisible, setCardEditVisible] = useState(false)
  const addItem = () => {
    if (collection === 'collages') {
      return (
        <AddCollage
          visible={cardEditVisible}
          opt={'edit'}
          setVisible={setCardEditVisible}
          itemData={itemData}
        />
      )
    }
    if (collection === 'fields') {
      return (
        <AddField
          visible={cardEditVisible}
          opt={'edit'}
          setVisible={setCardEditVisible}
          itemData={itemData}
        />
      )
    }
    if (collection === 'subjects') {
      return (
        <AddCollage
          visible={cardEditVisible}
          opt={'edit'}
          setVisible={setCardEditVisible}
          itemData={itemData}
        />
      )
    }
  }
  return (
    <>
      <CCard  className="p-2 m-0 text-center border-0 mb-2 me-2 py-3 j-box-shadow"  onClick={onClick}>
        <CRow className="gap-2 m-0 row align-items-center justify-content-center">
          <CCol className=" p-0 col-auto " style={{ width: '64px', height: '64px' }}>
            {/* <collageIcon style={{ height: '40px', width: '32px' }} /> */}
            <CCardImage src={cardIcon} />
          </CCol>
          <CCol className=" p-0   col" style={{}}>
            <h6>{title}</h6>
            <div
              className="d-flex flex-column justify-content-center"
              style={{ fontSize: '14px' }}
            >
              <span className="text-secondary">{subtitle}</span>
              <Link to={itemData.id}>
              <a className="text-primary ms-2">عرض التفاصيل</a>
              </Link>
            </div>
          </CCol>
          <CCol className="d-flex g-2 p-0 col-auto" style={{ width: 'fit-content' }}>
            <CCardImage
              className=""
              onClick={() => onEdit(itemData)}
              style={{ width: '32px' }}
              src={editIcon}
            />
            {withDeleteIcon && (
              <CCardImage
                onClick={() => onDelete(id)}
                className="ms-2 me-0"
                style={{ width: '32px' }}
                src={deleteIcon}
              />
            )}
          </CCol>
        </CRow>
      </CCard>
      {/* {addItem()} */}
    </>
  )
}

SpecialCard.propTypes = {
  /**
   * عنوان البطاقة
   */
  title: PropTypes.string,
  /**
   * What background color to use
   */
  subtitle: PropTypes.string,
  /**
   * How large should the button be?
   */
  withDeleteIcon: PropTypes.bool,
  /**
   * Button contents
   */
  cardIcon: PropTypes.object,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
}

SpecialCard.defaultProps = {
  title: 'كلية الحاسب وتقنية المعلومات',
  subtitle: 'عدد التخصصات #7',
  onClick: undefined,
  onDelete: undefined,
  onEdit: undefined,
  cardIcon: collageIcon,
  withDeleteIcon: true,
}
