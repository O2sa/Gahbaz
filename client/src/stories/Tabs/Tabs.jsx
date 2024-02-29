import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import { Tab } from './Tab'
import { Link, Outlet } from 'react-router-dom'

export const Tabs = ({ tabs, ...props }) => {
  const [activeKey, setActiveKey] = React.useState(0)
  return (
    <div className="bg-white" style={{minHeight: '80vh'}}>
      <CNav variant="tabs" className="p-0" role="tablist">
        {tabs.map((tab, idx) => (
            <Tab
              label={tab.name}
              tabIcon={tab.icon}
              k={idx}
              clickHandller={setActiveKey}
              activeKey={activeKey}
              to={tab.to}
            />
        ))}
      </CNav>
      <CTabContent  className="pb-4 ">
        {/* <CTabPane> */}
          <Outlet />
        {/* </CTabPane> */}
        {/* {tabs.map((tab, idx) => (
          <CTabPane role="tabpanel" aria-labelledby={tab.name}
           visible={activeKey === idx}
          >
            {tab.header}
            <div className='p-4'>
            {tab.body}
            </div>
          </CTabPane>
        ))} */}
      </CTabContent>
    </div>
  )
}

Tabs.propTypes = {
  //   /**
  //    * عنوان البطاقة
  //    */
  tabs: PropTypes.array,
  //   /**
  //    * What background color to use
  //    */
  //   placeholder: PropTypes.string,
  //   /**
  //    * How large should the button be?
  //    */
  //   textarea: PropTypes.bool,
  //   /**
  //    * Button contents
  //    */
  //   type: PropTypes.string,
  // }

  // Tabs.defaultProps = {
  //   label: 'Email Address',
  //   placeholder: 'عدد التخصصات #7',
  //   textarea: false,
  //   type: 'email',
}
