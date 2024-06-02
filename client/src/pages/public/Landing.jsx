import React, { useState } from 'react'
import Header from './landing_components/Header'
import SectionOne from './landing_components/SectionOne'
import SectionTwo from './landing_components/SectionTwo'
import SectionThree from './landing_components/SectionThree'
import SectionFour from './landing_components/SectionFour'
import SectionFive from './landing_components/SectionFive'
import Footer from './landing_components/Footer'
import About from './landing_components/About'
// import './index.scss'

import styled from 'styled-components'

const LandingWrapper = styled.div`
  #about {
    min-height: 100vh;
    height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 0px;
  }
  #about .about-content {
    text-align: center;
    background-color: #f2eaff;
    padding: 160px 120px;
    border-radius: 25px;
  }
  #about .about-content .title {
    color: rgb(45, 45, 45);
    font-size: 7vmin;
    letter-spacing: 2px;
    font-weight: 0;
    margin-top: 0px;
  }
  #about .about-content .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }
  #about .about-content a {
    color: #fd7e14;
  }
  @media only screen and (max-width: 1086px) {
    #about .about-content {
      padding: 110px 120px;
    }
  }
  @media only screen and (max-width: 768px) {
    #about .about-content {
      padding: 120px 40px;
    }
  }
  @media only screen and (max-width: 350px) {
    #about .about-content {
      padding: 80px 20px;
    }
  }
  @media only screen and (max-width: 425px) {
    #about .mantine-Container-root {
      padding: 0px;
    }
  }

  header {
    position: absolute;
    z-index: 99;
    /* Responsive header */
  }
  header .navbar {
    display: flex;
    flex-direction: row;
    gap: 25px;
    align-items: center;
  }
  header .navbar .navbar-item {
    cursor: pointer;
    font-weight: 500;
  }
  header .navbar .navbar-item a {
    color: #2d2d2d;
    transition: all 0.1s ease;
  }
  header .navbar .navbar-item a:hover {
    color: #fab005;
    text-decoration: none;
  }
  header .content-desktop {
    justify-content: space-between;
    display: flex;
    align-items: center;
  }
  header .content-mobile .burger-button {
    float: right;
  }
  @media only screen and (min-width: 769px) {
    header {
      top: 60px;
      left: 60px;
      right: 60px;
    }
    header .content-desktop {
      display: flex;
    }
    header .content-mobile {
      display: none;
    }
  }
  @media only screen and (max-width: 768px) {
    header {
      top: 30px;
      left: 20px;
      right: 20px;
    }
    header .content-desktop {
      display: none;
    }
    header .content-mobile {
      display: block;
    }
  }

  .menu {
    display: flex !important;
    flex-direction: column;
    justify-content: space-between !important;
    gap: 30px;
  }
  .menu .menu-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  footer {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  @media only screen and (max-width: 768px) {
    footer {
      text-align: center;
    }
  }

  #section-one h2,
  #section-one h3 {
    margin: 0;
    padding: 0;
  }
  @media only screen and (max-width: 769px) {
    #section-one .mantine-Carousel-root {
      padding-left: 0px;
      padding-right: 0px;
    }
  }

  .landing {
    margin: 0;
    padding: 0;
    background-color: rgb(248, 246, 246);
  }

  .landing section,
  .landing footer {
    padding: 4rem 0rem;
    padding-right: 60px;
    padding-left: 60px;
  }
  @media only screen and (max-width: 768px) {
    .landing section,
    .landing footer {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .landing section .mantine-Container-root,
    .landing footer .mantine-Container-root {
      padding: 0px;
    }
  }

  /*# sourceMappingURL=landingStyle.css.map */
`

const Landing = () => {
  return (
    <LandingWrapper>
      <div className="landing">
        <Header />
        <About />

        <SectionOne />

        <SectionTwo />

        <SectionThree />

        <SectionFour />

        <SectionFive />
        <Footer />
      </div>
    </LandingWrapper>
  )
}

export default Landing
