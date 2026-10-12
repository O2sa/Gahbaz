import React from 'react'
import { Box, useMantineTheme } from '@mantine/core'
import Header from './landing_components/Header'
import About from './landing_components/About'
import SectionOne from './landing_components/SectionOne'
import SectionTwo from './landing_components/SectionTwo'
import SectionThree from './landing_components/SectionThree'
import SectionFour from './landing_components/SectionFour'
import SectionFive from './landing_components/SectionFive'
import Footer from './landing_components/Footer'

const Landing = () => {
  const theme = useMantineTheme()
  const isDark = theme.colorScheme === 'dark'

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: isDark ? theme.colors.dark[8] : '#f8fafc',
        color: isDark ? theme.colors.dark[0] : theme.colors.gray[9],
        overflowX: 'hidden',
        transition: 'background-color 0.25s ease',
      }}
    >
      <Header />
      <About />
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <SectionFive />
      <Footer />
    </Box>
  )
}

export default Landing
