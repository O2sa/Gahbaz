import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'
// import { TabsBody } from 'src/stories/Tabs/TabsBody'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown, HeaderIcons } from './header/index'
import { TextInput, ActionIcon, useMantineTheme, rem, Container, Tooltip } from '@mantine/core'
import {
  IconSearch,
  IconArrowRight,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarLeftCollapse,
} from '@tabler/icons-react'

const AppHeader = ({ sidebarShow, stateChange }) => {
  // const dispatch = useDispatch()
  // const sidebarShow = useSelector((state) => state.sidebarStates.sidebarShow)

  return (
    <CHeader
      position="sticky"
      style={{ zIndex: 98, backgroundColor: 'transparent' }}
      className="m-0 p-0 border-0"
    >
      <CContainer className="bg-white p-2" fluid>
        {/* <CHeaderToggler
          className="ps-1"
          onClick={() => stateChange({ sidebarShow: !sidebarShow.sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler> */}

        <Tooltip label="Toggle side navigation">
          <ActionIcon
            color="brand"
            size="lg"
            onClick={() => stateChange({ sidebarShow: !sidebarShow.sidebarShow })}
          >
            {sidebarShow ? (
              <IconLayoutSidebarLeftCollapse />
            ) : (
              <IconLayoutSidebarLeftExpand />
            )}
          </ActionIcon>
        </Tooltip>
        {/* <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand> */}
        {/* <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              لوحة التحكم
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">المستخدمون</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">الإعدادت</CNavLink>
          </CNavItem>
        </CHeaderNav> */}
        {/* <CHeaderNav className="ms-auto"> */}
        {/* <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem> */}
        {/* 
          <TextInput
            radius="xl"
            size="md"
            placeholder="Search questions"
            rightSectionWidth={42}
            leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
            rightSection={
              <ActionIcon size={32} radius="xl" variant="filled">
                <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
            }
          />
        </CHeaderNav> */}

        <CHeaderNav className="ms-3">
        <HeaderIcons />

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {/* <CHeaderDivider /> */}
      <Container
        w={'100%'}
        fluid
        p={'md'}
        // bg={'gray'}

        className="header-blur bg-light"
        // style={{ backdropFilter: blur('50px') }}
        sx={{
          margin: '0',
          filter: 'none',
          backdropFilter: blur('50px'),
          // borderWidth: '1.5px',
          // borderStyle: 'solid',
        }}
      >
        <AppBreadcrumb />
      </Container>
    </CHeader>
  )
}

export default AppHeader
