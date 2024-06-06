// Breadcrumbs.js
import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { matchRoutes } from 'react-router-dom'
import getRoutes from '../routes'
import {
  addFaveriteLink,
  addRecentMaterial,
  isFavrite,
  removeFaveriteLink,
} from '../utils/recentMaterials'
import { ActionIcon, Box, Group, Rating, Title } from '@mantine/core'
import { useToggle } from '@mantine/hooks'
import { CiStar } from 'react-icons/ci'
import { FaRegStar } from 'react-icons/fa'
import { router } from '../App'
const AppBreadcrumb = () => {
  const location = useLocation()
  const matches = matchRoutes([getRoutes()], location)
  const [faverite, setfaverite] = useState(false)

  // Generate unique breadcrumbs
  const breadcrumbs = matches.reduce((acc, match, index) => {
    const route = match.route
    const path = match.pathname

    // Avoid duplicate paths
    if (!acc.find((b) => b.path === path)) {
      acc.push({ name: route.name, path })
    }

    return acc
  }, [])

  const [value, toggle] = useToggle([0, 1])
  useEffect(() => {
    addRecentMaterial(breadcrumbs[breadcrumbs.length - 1])

    if (isFavrite(breadcrumbs[breadcrumbs.length - 1])) setfaverite(true)
    else setfaverite(false)
  }, breadcrumbs)

  const handleFavrite = (val) => {
    console.log(val)
    if (faverite == true) {
      setfaverite(false)
      removeFaveriteLink(breadcrumbs[breadcrumbs.length - 1])
    } else if (faverite == false) {
      setfaverite(true)
      addFaveriteLink(breadcrumbs[breadcrumbs.length - 1])
    }
  }
  // console.log('location', location)
  // console.log('matches', matches)
  // console.log('value', value)

  return (
    <>
      <Group mb={'0'} aria-label="breadcrumb">
        <ol className="breadcrumb my-auto">
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1
            return isLast ? (
              <li key={breadcrumb.path} className="breadcrumb-item active" aria-current="page">
                {breadcrumb.name}
              </li>
            ) : (
              <li key={breadcrumb.path} className="breadcrumb-item">
                <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
              </li>
            )
          })}
        </ol>
        <ActionIcon
          onClick={handleFavrite}
          color={faverite ? 'yellow' : 'gray'}
          variant="transparent"
          size="sm"
          radius="xl"
          aria-label="faverite"
        >
          <FaRegStar style={{ width: '100%', height: '100%' }} stroke={1.5} />
        </ActionIcon>
      </Group>
      <Title order={2}>{breadcrumbs[breadcrumbs.length - 1].name}</Title>
    </>
  )
}

export default AppBreadcrumb
