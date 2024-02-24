import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CListGroup, CButton, CListGroupItem } from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { RiTable2 } from 'react-icons/ri'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Multiselect from 'multiselect-react-dropdown'

export const SemesterTemplateDetails = ({
  title = 'البرمجة المرئية 01: الفصل الأول',
  k,
  clickHandller,
  activeKey,
  tabIcon,
  ...props
}) => {
  const { id } = useParams()
  // console.log(id)

  useEffect(() => {
    dispatch(asyncCrudThunks.semesterTemplates.getItemThunk(id))
    dispatch(asyncCrudThunks.subjects.getItemsThunk())
  }, [])

  const onDelete = (value) => {
    // We're dispatching the Pinned event back to our store
    // dispatch(asyncCrudThunks.subjects.deleteItemThunk(value))
    let index = options.findIndex((item) => item.id == value)
    if (index !== -1) {
      options[index].selected = false
    }
    setSelectedItems(selectedItems.filter((item) => item.id != value))
  }

  // const items = useSelector((state) => {
  //   return state.collagesManagement.subjects
  // })
  let items = [
    {
      name: 'Mathematics',
      subtitle: 'Advanced Calculus',
      kind: 'Management',
      selected: true,
      id: '1',
    },
    {
      name: 'Mathematics',
      subtitle: 'Advanced Calculus',
      kind: 'Management',
      selected: false,
      id: '2',
    },
    {
      name: 'Mathematics',
      subtitle: 'Advanced Calculus',
      kind: 'Management',
      selected: true,
      id: '3',
    },
    {
      name: 'Mathematics',
      subtitle: 'Advanced Calculus',
      kind: 'Management',
      selected: false,
      id: '4',
    },
  ]
  const semsterTemp = useSelector((state) => {
    return state.collagesManagement.semesterTemplate
  })

  const { status } = useSelector((state) => state.collagesManagement.status)
  const dispatch = useDispatch()

  let options = items.map((item) => ({ ...item, key: item.name + item.id, id: item.id }))
  const [selectedItems, setSelectedItems] = useState(options.filter((item) => item.selected))

  const [isOpen, setAddState] = useState(false)

  // console.log('options', options)
  // console.log('selectedItems', selectedItems)

  const onSelect = (selectedList, selectedItem) => {
    // console.log('selectedList', selectedList)
    // console.log('selectedItem', selectedItem)
    setSelectedItems((prev) => [...prev, selectedItem])
  }

  const renderCards = () => {
    return selectedItems.map((item, idx) => (
      <CListGroupItem component="a" key={idx} className="m-2 w-auto border-1">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <RiTable2 size={'32'} className="me-3" />
            <div>
              <h5 className={''}> {item.name}</h5>
              <span className={`text-secondary`}> {item.kind}</span>{' '}
            </div>{' '}
          </div>
          <div className="d-flex align-items-center">
            <AiTwotoneDelete onClick={() => onDelete(item.id)} size={'32'} className="me-2" />
            {/* <CiEdit size={'32'} /> */}
          </div>
        </div>
      </CListGroupItem>
    ))
  }

  return (
    <CListGroup>
      <CListGroupItem className="m-2 border-0">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <RiTable2 size={'32'} className="me-3" />
            <div>
              <h4 className={''}>{semsterTemp && semsterTemp.name}</h4>
            </div>{' '}
          </div>
          <div className="d-flex align-items-center">
            {/* <AiTwotoneDelete size={'32'} className="me-2" /> */}
            <CiEdit size={'32'} />
          </div>
        </div>
      </CListGroupItem>
      {renderCards()}
      {/* <CListGroupItem
        component="a"
        key={'index'}
        className="m-2 border-1 p-0 text-primary bg-primary bg-opacity-10"
      >
       
      </CListGroupItem> */}
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
                displayValue="key"
                showCheckbox
                hideSelectedList
                onKeyPressFn={function noRefCheck() {}}
                onRemove={function noRefCheck() {}}
                onSearch={function noRefCheck() {}}
                onSelect={onSelect}
                options={options}
                selectedValues={selectedItems}
              />
            </div>
          )}
        </div>
    </CListGroup>
  )
}
