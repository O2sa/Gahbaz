import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SpecialCard } from './Specialcard'
import { CCol, CRow } from '@coreui/react'
import { getCollages } from 'src/apis/apis.mjs'
import { Link, useLoaderData } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
import { AddCollage } from '../screens/AddCollage'
import { AddField } from '../screens/AddField'
export default function CardsGroup({ collection, editModel, ...props }) {
  
  useEffect(() => {
    dispatch(asyncCrudThunks[`${collection}`].getItemsThunk())
  }, [])

  const onDelete = (value) => {
    // We're dispatching the Pinned event back to our store
    dispatch(asyncCrudThunks[`${collection}`].deleteItemThunk(value))
  }
  const togglePopover = (d) => {
    console.log(d)
    setModelData((prev) => ({
      ...prev,
      isPopoverOpen: !prev.isPopoverOpen,
      data: d ?? {},
    }))
    console.log(modelData)
  }
  const items = useSelector((state) => {
    return state.collagesManagement[`${collection}`]
  })

  const { status } = useSelector((state) => state.collagesManagement.status)
  const dispatch = useDispatch()

  const [modelData, setModelData] = useState({ isPopoverOpen: false, data: {} })

  const renderCards = () => {
    return items.map((item) => (
      // <Link to={item.id}>
        <SpecialCard
          title={item.name}
          id={item.id}
          subtitle={`عدد التخصصات #${item.fieldsNum || item.semestersNum || item.subtitle}`}
          onDelete={onDelete}
          onEdit={togglePopover}
          // editModel={editModel}
          itemData={item}
          collection={collection}
          to={`${collection}/${item.id}`}
        />
      // </Link>
    ))
  }

  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  )
  if (status === 'loading') {
    return (
      <div className="list-items" data-testid="loading" key={'loading'}>
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <div className="list-items" key={'empty'} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
        </div>
      </div>
    )
  }
  const Model = editModel
  return (
    <CRow className="g-4 row-cols-auto justify-content-center">
      {renderCards()}
      {modelData.isPopoverOpen && (
        <Model opt={'edit'} itemData={modelData.data} onClose={togglePopover} />
      )}
    </CRow>
  )
}

CardsGroup.propTypes = {
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

CardsGroup.defaultProps = {
  label: 'Email Address',
  placeholder: 'عدد التخصصات #7',
  textarea: false,
  type: 'email',
}
