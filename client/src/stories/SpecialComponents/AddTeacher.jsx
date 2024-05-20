import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CListGroup, CButton, CListGroupItem, CAvatar } from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { TbMenuOrder } from 'react-icons/tb'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import avatar2 from '../../assets/images/avatars/2.jpg'
import { IoReorderFourOutline } from 'react-icons/io5'
import Multiselect from 'multiselect-react-dropdown'

export const AddTeacher = ({
  teachers,
  selectedItems,
  setSelectedItems,

  ...props
}) => {

  const onDelete = (value) => {
    // We're dispatching the Pinned event back to our store
    // dispatch(asyncCrudThunks.subjects.deleteItemThunk(value))
    let index = teachers.findIndex((item) => item.id == value)
    if (index !== -1) {
      teachers[index].selected = false
    }
    setSelectedItems(selectedItems.filter((item) => item.id != value))
  }

  
  const onSelect = (selectedList, selectedItem) => {
    // console.log('selectedList', selectedList)
    // console.log('selectedItem', selectedItem)
    setSelectedItems((prev) => [...prev, selectedItem])
  }
  const [isOpen, setAddState] = useState(false)

          
  return (
    <CListGroup className="bg-primary bg-opacity-10 m-2 ">
      <CListGroupItem className="m-2 bg-transparent border-0">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <TbMenuOrder size={'32'} className="me-3" />
            <div>
              <h4 className={''}>المحاضرون</h4>
            </div>{' '}
          </div>
        </div>
      </CListGroupItem>

      {selectedItems.map((item, index) => (
        <CListGroupItem component="a" key={index} className="m-2 border-1 w-auto">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <IoReorderFourOutline size={'32'} className="me-3" />
              <CAvatar size="md" className="me-3" src={avatar2} />
              <div>
                <h5 className={''}> {item.name}</h5>
                <span className={`text-secondary`}> {item.id}</span>{' '}
              </div>{' '}
            </div>
            <div className="d-flex align-items-center">
              <AiTwotoneDelete onClick={()=>onDelete(item.id)} size={'32'} className="me-2" />
            </div>
          </div>
        </CListGroupItem>
      ))}
      <CListGroupItem
        component="a"
        key={'index'}
        className="m-2 border-1 p-0 text-primary bg-primary bg-opacity-10 w-auto"
      >
        <div className="d-flex flex-column ">
          <div className="mb-2">
            <CButton
              onClick={() => setAddState((prv) => !prv)}
              className="w-100 fs-4"
              width={'auto'}
              color="primary"
            >
              {isOpen ? 'حفظ' : 'إضافة'}
            </CButton>
          </div>
          {isOpen && (
            <div>
              <Multiselect
                displayValue="name"
                showCheckbox
                hideSelectedList
                onKeyPressFn={function noRefCheck() {}}
                onRemove={function noRefCheck() {}}
                onSearch={function noRefCheck() {}}
                onSelect={onSelect}
                options={teachers}
                selectedValues={selectedItems}
              />
            </div>
          )}
        </div>
      </CListGroupItem>
    </CListGroup>
  )
}
