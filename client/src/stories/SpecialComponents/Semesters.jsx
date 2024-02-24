import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CListGroup,
  CButton,
  CListGroupItemCTable,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { RiTable2 } from 'react-icons/ri'
import { AiTwotoneDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import 'react-data-grid/lib/styles.css'
import { TabsBody } from '../Tabs/TabsBody'
import DataGrid from 'react-data-grid'
import { TableBody } from '@mui/material'
import { AddCollage } from '../screens/AddCollage'
import { Link, NavLink } from 'react-router-dom'
import { TbListDetails } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'

export const Semesters = ({
  rows = [
    {
      name: 'الفصل السابع',
      subtitle: 'علوم حاسب، مستوى 4',
      studentsNum: 100,
      coursesNum: 8,
      period: '4sep-203 to 4May-2023',
      status: 'completed',
    },
    {
      name: 'الفصل السابع',
      subtitle: 'علوم حاسب، مستوى 4',
      studentsNum: 100,
      coursesNum: 8,
      period: '4sep-203 to 4May-2023',
      status: 'completed',
    },
    {
      name: 'الفصل السابع',
      subtitle: 'علوم حاسب، مستوى 4',
      studentsNum: 100,
      coursesNum: 8,
      period: '4sep-203 to 4May-2023',
      status: 'completed',
    },
    {
      name: 'الفصل السابع',
      subtitle: 'علوم حاسب، مستوى 4',
      studentsNum: 100,
      coursesNum: 8,
      period: '4sep-203 to 4May-2023',
      status: 'completed',
    },
  ],
}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(asyncCrudThunks.semesters.getItemsThunk())
  }, [])

  const status = useSelector((state) => {
    return state.collagesManagement.status
  })

  const semesters = useSelector((state) => {
    return state.collagesManagement.semesters
  })

  // console.log(collage)

  if (status === 'loading') {
    return (
      <div className="list-items" data-testid="loading" key={'loading'}>
        Loading
      </div>
    )
  }

  return (
    <div className="">
      <TabsBody addModel={AddCollage} label={'بدء فصل جديد'} title={'الفصول الحالية'} />
      <div className="m-4 mt-5">
        <CTable hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell className="text-secondary" scope="col">
                الفصل
              </CTableHeaderCell>
              <CTableHeaderCell className="text-secondary" scope="col">
                عدد الطلاب
              </CTableHeaderCell>
              <CTableHeaderCell className="text-secondary" scope="col">
                عدد الدورات
              </CTableHeaderCell>{' '}
              <CTableHeaderCell className="text-secondary" scope="col">
                الفترة
              </CTableHeaderCell>{' '}
              <CTableHeaderCell className="text-secondary" scope="col">
                الحالة
              </CTableHeaderCell>{' '}
              <CTableHeaderCell className="text-secondary" scope="col">
                الحالة
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>{' '}
          <CTableBody>
            {semesters.map((item, idx) => (
              <CTableRow className="" key={idx}>
                <CTableHeaderCell scope="row">
                  <div>
                    <h5 className={''}>
                      {' '}
                      {item.name}
                      <span className={`text-secondary fs-6`}>{' (خريف 2023)'} </span>{' '}
                    </h5>
                    <span className={`text-secondary`}> {`${item.field}، ${item.level}`}</span>{' '}
                  </div>{' '}
                </CTableHeaderCell>
                <CTableDataCell>
                  <div className="d-flex align-items-center">{item.studentsNum}</div>
                </CTableDataCell>{' '}
                <CTableDataCell>
                  <div>{item.coursesNum}</div>
                </CTableDataCell>{' '}
                <CTableDataCell>
                  <div>{`${item.startDate} الى ${item.endDate}`}</div>
                </CTableDataCell>{' '}
                <CTableDataCell>
                  <div>{item.completed === 'completed' ? 'مكتمل' : ' ما زال'}</div>
                </CTableDataCell>{' '}
                <CTableDataCell>
                  <Link className="" to={`/currentSemester/${item.id}`}>
                    <TbListDetails />{' '}
                  </Link>
                </CTableDataCell>
              </CTableRow>
            ))}{' '}
          </CTableBody>
        </CTable>
      </div>
    </div>
  )
}
