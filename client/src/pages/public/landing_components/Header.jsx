import { Button, Badge, Burger, Drawer, Code, Title, Anchor, Text, Image } from '@mantine/core'
import { UnstyledButton, Group, Avatar } from '@mantine/core'
import React from 'react'
import { Link } from 'react-scroll'

import { Link as RouterLink } from 'react-router-dom'
import logo from '../../../assets/brand/Logo.svg'
const Header = () => {
  //const theme = useMantineTheme();
  const [opened, setOpened] = React.useState(false)
  const title = opened ? 'Close navigation' : 'Open navigation'

  return (
    <header>
      <div className="content-desktop">
        <div>
          <Image src={logo} />
        </div>
        <div className="navbar">
          <div className="navbar-item">
            <Link to="section-one" smooth duration={500}>
              خدمات المنصة
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="section-four" smooth duration={500}>
              المميزات
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="section-five" smooth duration={500}>
              الأسئلة الشائعة
            </Link>
          </div>
          <RouterLink to={'/login'}>
            <Button color="brand">تسجيل الدخول</Button>
          </RouterLink>
        </div>
      </div>

      <div className="content-mobile">
        <div className="burger-button">
          <Burger opened={opened} onClick={() => setOpened((o) => !o)} title={title} size="sm" />
        </div>

        <Drawer
          transition="rotate-right"
          transitionDuration={250}
          transitionTimingFunction="ease"
          overlayOpacity={0.55}
          position="right"
          closeButtonLabel="Close drawer"
          title="Menu"
          padding="xl"
          opened={opened}
          onClose={() => setOpened(false)}
        >
          <div className="menu">
            <div className="menu-items">
              <div className="menu-item">
                <Link to="section-one" smooth duration={500} onClick={() => setOpened(false)}>
                  <Title order={2}> خدمات المنصة</Title>
                </Link>
              </div>
              <div className="menu-item">
                <Link to="section-four" smooth duration={500} onClick={() => setOpened(false)}>
                  <Title order={2}>المميزات</Title>
                </Link>
              </div>
              <div className="menu-item">
                <Link to="section-five" smooth duration={500} onClick={() => setOpened(false)}>
                  <Title order={2}> الأسئلة الشائعة</Title>
                </Link>
              </div>
            </div>

            <div className="menu-items">
              <Text>Contact</Text>

              <Anchor href="mailto:example@mail.com">example@mail.com</Anchor>
            </div>

      
          </div>
        </Drawer>
      </div>
    </header>
  )
}

export default Header

const redirectToLink = (link) => {
  window.open(link, '_blank')
}
