/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import avatar3 from 'src/assets/images/avatars/3.jpg'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCardFooter,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CWidgetStatsF,
} from '@coreui/react'
import { cilChartPie, CIcon } from '@coreui/icons'

// eslint-disable-next-line react/prop-types
function MyText({ text = '', classes = '' }) {
  return <span className={`${classes}`}>{text}</span>
}

// eslint-disable-next-line react/prop-types
function StatusBadge({ status = 'success', content = '' }) {
  return (
    <CBadge color={status} className="bg-opacity-25 " shape="rounded-pill">
      <MyText text={content} classes={`text-${status} fs-4 p-2`} />
    </CBadge>
  )
}
const CourseGradeWPhone = {
  Present: 'الحضور',
  Assignments: 'التكاليف',
  'Middle Exam': 'الإختبار النصفي',
  'Final Exam': 'العملي',
  Practice: 'الإختبار النهائي',
}
// eslint-disable-next-line react/prop-types
function GradesTablePhone({ data }) {
  return (
    <div className="w-100 mb-3 bg-white">
      <div className="hstack p-3 border-bottom">
        <div className="">
          <h5>{data.header[0]}</h5>
        </div>
        <div className=" ms-auto text-end">
          <MyText text={'الدرجات'} classes="text-secondary d-block mb-1" />
          <StatusBadge content={data.header[1]} />
        </div>
      </div>
      {data.body.map((item, index) => (
        <VerticalStack
          items={[
            <h5 className="text-secondary mb-1">{Object.values(CourseGradeWPhone)[index]}</h5>,
            <MyText classes={'fs-5'} text={item} />,
          ]}
        />
      ))}
    </div>
  )
}

function VerticalStack({ items }) {
  return (
    <div className="hstack p-3 ">
      <div className="">{items[0]}</div>
      <div className=" ms-auto">{items[1]}</div>
    </div>
  )
}
function GradesTableDesktop({ desktopTableData }) {
  return (
    <CTable className="w-100">
      <CTableHead>
        <CTableRow>
          {desktopTableData.header.map((item, index) => (
            // eslint-disable-next-line react/jsx-key
            <CTableDataCell>
              <MyText text={item} classes="text-secondary" />
            </CTableDataCell>
          ))}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {desktopTableData.body.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <CTableRow>
            {item.map((cell) => (
              <CTableDataCell>
                <MyText text={cell} />
              </CTableDataCell>
            ))}
            {/* <CTableDataCell>
              {SeasonGradesSum(item.courses).courseSums[index] >= 50 ? (
                <StatusBadge
                  content={SeasonGradesSum(item.courses).courseSums[index]}
                  status="success"
                />
              ) : (
                <CBadge color="danger" shape="rounded-pill">
                  {SeasonGradesSum(item.courses).courseSums[index]}
                </CBadge>
              )}
            </CTableDataCell> */}
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

function FlexRaw({ items, classes = '' }) {
  return (
    <div
      className={`d-flex w-100 justify-content-between bg-white align-items-center p-2 mb-2 ${classes}`}
    >
      {items.map((item) => (
        <div className="text-center">{item}</div>
      ))}
    </div>
  )
}

const TitleAndSub = (title, subtit) => (
  <>
    <h4 className={title.classes}> {title.txt}</h4>
    <MyText text={`${subtit.txt}`} classes={`text-secondary ${subtit.classes}`} />
  </>
)
export {
  GradesTableDesktop,
  GradesTablePhone,
  MyText,
  StatusBadge,
  FlexRaw,
  VerticalStack,
  TitleAndSub,
  UserAvatar,
}

function UserAvatar({ avtar = avatar3, name = 'غير معرف', id = '000000' }) {
  return (
    <div className="d-flex align-items-center">
      <CAvatar src={avtar} />
      <div className="ms-1">{TitleAndSub({ txt: name, classes: 'fs-6 mb-0' }, { txt: id })}</div>
    </div>
  )
}
