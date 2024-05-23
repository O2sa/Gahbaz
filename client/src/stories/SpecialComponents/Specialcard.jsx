import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CCard, CCol, CCardBody, CRow, CCardText, CCardTitle, CCardImage } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import collageIcon from '../assets/CollageIcon.svg'
import deleteIcon from '../assets/DeleteIcon.svg'
import editIcon from '../assets/EditIcon.svg'
import { Form } from 'react-router-dom'

import { Link } from 'react-router-dom'
import { ActionIcon, Grid, Group } from '@mantine/core'
import { IconEdit, IconPills } from '@tabler/icons-react'

import { MdDelete } from 'react-icons/md'
import DeleteElement from '../../pages/DeleteElement'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { AiFillBank } from 'react-icons/ai'
import customFetch from '../../utils/customFetch'
import { useDeleteElement } from '../../pages/crud'
import EditCollage from '../../pages/admin/EditCollage'



export const SpecialCard = ({ data, queryClient, collection, Component, deltails }) => {
  const { mutateAsync: deleteElement, isLoading: isLoading } = useDeleteElement(
    queryClient,
    collection,
  )

  const handleDelete = async () => {
    console.log('values')
    console.log(data._id)
    try {
      await deleteElement(data._id)
      //   console.log(res)
      // notifications.show({
      //   id: 'collage-created',
      //   title: 'Success!',
      //   message: 'Collage created successfully!',
      //   variant: 'success',
      //   autoClose: 5000,
      // })
    } catch (error) {
      console.log(error)
      notifications.show({
        id: 'collage-creation-error',
        title: 'Error!',
        message: error?.response?.data?.msg || 'An error occurred while creating the collage.',
        variant: 'danger',
        autoClose: 5000,
      })
    }
  }

  const editComponent = (
    <ActionIcon type="submit" size="lg" radius="md" color="gray.6" variant="light">
      <IconEdit size="1.625rem" />
    </ActionIcon>
  )
  return (
    <Grid
      sx={{
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // height: '100vh',
        // margin: '0',
        // backgroundColor: '#f0f0f0',
        margin: '20px',
        padding: '10px',
        // width: '300px',
        // padding: '20px',
        // borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
        transition: ' box-shadow 0.3s ease-in-out' /* Smooth transition for shadow */,
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 12px 24px rgba(0, 0, 0, 0.1)',
        },
      }}
      w={350}
      gutter={4}
      align="center"
    >
      <Grid.Col mr={6} span={'content'}>
        {/* <CCol className=" p-0 col-auto " style={{ width: '64px', height: '64px' }}> */}
        {/* <collageIcon style={{ height: '40px', width: '32px' }} /> */}
        {/* <CCardImage src={collageIcon} /> */}
        <ActionIcon color="primary" className="" size="64px" radius="xs" variant="light">
          <AiFillBank size="2.125rem" />
        </ActionIcon>
        {/* </CCol> */}
      </Grid.Col>
      <Grid.Col span={6}>
        <Link to={`${deltails}`}>
          <h6>{data.name}</h6>
          <div className="d-flex flex-column justify-content-center" style={{ fontSize: '14px' }}>
            <span className="text-secondary"> عدد الفصول: {data.numberOfSemesters || ''}</span>
          </div>
        </Link>
      </Grid.Col>
      <Grid.Col span={'content'}>
        <Grid gutter={3}>
          <Grid.Col span={6}>
            <Component component={editComponent} data={data} queryClient={queryClient} />
          </Grid.Col>{' '}
          <Grid.Col span={6}>
            <ActionIcon color="gray.6" variant="light" onClick={handleDelete} size="lg" radius="md">
              <MdDelete size="1.625rem" />
            </ActionIcon>{' '}
          </Grid.Col>
        </Grid>
      </Grid.Col>
    </Grid>
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
