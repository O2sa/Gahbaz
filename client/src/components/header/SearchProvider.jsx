import React, { useState, useEffect } from 'react'
import {
  ActionIcon,
  Button,
  Paper,
  Group,
  Text,
  TextInput,
  UnstyledButton,
  rem,
  Center,
} from '@mantine/core'
import { SpotlightProvider, spotlight } from '@mantine/spotlight'
import { IconSearch } from '@tabler/icons-react'
import { useMediaQuery } from '@mantine/hooks'
import customFetch from '../../utils/customFetch'
import { useNavigate } from 'react-router-dom'
import getNavs from '../../_nav'
const ICON_SIZE = 20

const groups = {
  courses: 'الدورات',
  collages: 'الكليات',
  users: 'المستخدمون',
  majors: 'التخصصات',
}

function SpotlightControl() {
  const laptop_match = useMediaQuery('(max-width: 992px)')
  const tablet_match = useMediaQuery('(max-width: 768px)')
  const mobile_match = useMediaQuery('(max-width: 425px)')

  return (
    <Group gap={0} onClick={spotlight.open}>
      {!mobile_match && (
        <UnstyledButton>
          <Paper p={rem('8px')} withBorder w={200}>
            <Center>
              <Group w={'100%'}  position="apart">
                <Text color="dimmed">بحث</Text>
                <Text color="dimmed">
                  {' '}
                  <IconSearch size={ICON_SIZE} />
                </Text>
              </Group>
            </Center>
          </Paper>
        </UnstyledButton>
      )}
      {mobile_match && (
        <ActionIcon>
          <IconSearch size={ICON_SIZE} />
        </ActionIcon>
      )}
    </Group>
  )
}

function SearchProvider() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const [actions, setActions] = useState(
    getNavs().map((val) => ({
      title: val.name,
      description: `انتقل الى ${val.name}`,
      onTrigger: () => navigate(val.to),
      icon: val.icon,
    })),
  )

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        try {
          const { data } = await customFetch.get(`/system/search?q=${query}`)

          let newActions = []

          for (const ele in data) {
            let temp = data[ele]?.map((result) => ({
              title: result.name || result.title,
              description: result.description || '',
              group: groups[ele],
              onTrigger: () => {
                // Define what happens when a search result is clicked
                navigate(`/${ele}/${result._id}`)
                // Example: navigate to a detail page
                // window.location.href = `/details/${result._id}`;
              },
            }))
            newActions = [...newActions, ...temp]
          }

          setActions(newActions)
        } catch (error) {
          console.error('Error fetching search results:', error)
        }
      }
    }

    fetchSearchResults()
  }, [query])

  return (
    <SpotlightProvider
      actions={actions}
      query={query}
      onQueryChange={setQuery}
      searchIcon={<IconSearch size="1.2rem" />}
      searchPlaceholder="بحث..."
      shortcut="mod + shift + 1"
      nothingFoundMessage="لا يوجد شيء..."
      keepMounted={false}
    >
      <SpotlightControl />
    </SpotlightProvider>
  )
}

export default SearchProvider
