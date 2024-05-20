import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import { Tab } from './Tab'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Tabs } from '@mantine/core'
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react'

export const TabsLinks = ({ tabs, ...props }) => {
  const [activeKey, setActiveKey] = React.useState(0)
  return (
    <div className="bg-white" style={{ minHeight: '80vh' }}>
      <CNav variant="tabs" className="p-0" role="tablist">
        {tabs.map((tab, idx) => (
          <Tab
            label={tab.name}
            TabIcon={tab.icon}
            k={idx}
            clickHandller={setActiveKey}
            activeKey={activeKey}
            to={tab.to}
          />
        ))}
      </CNav>
      <CTabContent className="pb-4 ">
        <Outlet />
      </CTabContent>
    </div>
  )
}

// export const TabsLinks = ({ tabs, Panels, ...props }) => {
//   const navigate = useNavigate()
//   const { tabValue } = useParams()
//   // const location = useLocation()

//   const Component = Panels
//   // const tabValue = location.pathname.split('/').pop()
//   console.log(tabValue)
//   return (
//     <Tabs
//       color="violet"
//       defaultValue="about"
//       //  value={tabValue} onTabChange={(value) => navigate(`${value}`)}
//     >
//       <Tabs.List>
//         {tabs.map((tab, idx) => (
//           // <Link to={tab.to}>
//           <Tabs.Tab icon={<tab.icon size="0.8rem" k={idx} value={tab.to} />}>{tab.name}</Tabs.Tab>
//           // </Link>
//         ))}
//       </Tabs.List>

//       <Outlet />
//     </Tabs>
//   )
// }
TabsLinks.propTypes = {
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
