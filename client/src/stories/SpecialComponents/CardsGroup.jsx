import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SpecialCard } from './Specialcard'

import { useDispatch, useSelector } from 'react-redux'
import { asyncCrudThunks } from '../../dataLogic/CollageManagementSlice'
import { Grid, SimpleGrid } from '@mantine/core'

export default function CardsGroup({
  queryClient,
  collection,
  items,
  EditComponent,
  root = false,
  ...props
}) {
  const renderCards = () => {
    return items.map((item) => (
      // <Link to={item.id}>
      <SpecialCard
        key={item._id}
        id={item._id}
        data={item}
        queryClient={queryClient}
        collection={collection}
        Component={EditComponent}
        deltails={root ? `/${collection[0]}/${item._id}` : `${item._id}`}
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

  // if (status === 'loading') {
  //   return (
  //     <div className="list-items" data-testid="loading" key={'loading'}>
  //       {LoadingRow}
  //       {LoadingRow}
  //       {LoadingRow}
  //       {LoadingRow}
  //       {LoadingRow}
  //       {LoadingRow}
  //     </div>
  //   )
  // }

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

  return <Grid gutter={7}>{renderCards()}</Grid>
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
