import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Box, Flex, Grid, Group, Tabs, Text, Title } from '@mantine/core'
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react'
import { Helmet } from 'react-helmet'

export const TabsLinks = ({ tabs, ...props }) => {
  const [activeKey, setActiveKey] = React.useState(0)
  return (
    <Box bg={'white'} sx={{ minHeight: '80vh' }}>

      <Tabs defaultValue={tabs[0].name}>
        <Grid grow gutter={'xs'} sx={{gap:0}}>
          {tabs.map((tab, idx) => (
            <Grid.Col span={'auto'}>
              <Link to={tab.to}>
                <Tabs.Tab w={'100%'} icon={<tab.icon size="1.5rem" />} value={tab.name}>
                  {' '}
                  <Text size={'md'}>{tab.name}</Text>
                </Tabs.Tab>{' '}
              </Link>
            </Grid.Col>
          ))}
        </Grid>
      </Tabs>
      <Box className="pb-4 ">
        <Outlet />
      </Box>
    </Box>
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
