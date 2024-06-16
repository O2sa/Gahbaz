import React from 'react'
import {
  SimpleGrid,
  Skeleton,
  Stack,
  Image,
  Container,
  Title,
  Text,
  Button,
  Box,
  Flex,
  Group,
  Center,
} from '@mantine/core'
import notFoundImg from '../assets/images/not-found.svg'
import { IconMoodEmpty } from '@tabler/icons-react'
import { PiEmpty } from 'react-icons/pi'

const loadingCircle = ({ height }) => <Skeleton circle height={height} />
const loadingRec = ({ height }) => <Skeleton height={height} />

export const SemestersLoader = () => {
  return (
    <Stack m={'lg'} mb={10}>
      {loadingRec({ height: 60 })}
      {loadingRec({ height: 60 })}
      {loadingRec({ height: 60 })}
      {loadingRec({ height: 60 })}
    </Stack>
  )
}

export const CardLoader = () => {
  return (
    <Flex m={'md'} justify={'center'} gap="xl" wrap={'wrap'}>
      <Skeleton height={80} width={350} />
      <Skeleton height={80} width={350} />
      <Skeleton height={80} width={350} />
      <Skeleton height={80} width={350} />
    </Flex>
  )
}

export const ChatContactsLoader = () => {
  return (
    <>
      <Flex mx={8} gap={'xs'} w={'100%'}>
        <Skeleton w={'20%'} circle height={'100%'} />{' '}
        <Group w={'80%'} gap={'0'}>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} />
        </Group>
      </Flex>{' '}
      <Flex mx={8} gap={'xs'} w={'100%'}>
        <Skeleton w={'20%'} circle height={'100%'} />{' '}
        <Group w={'80%'} gap={'0'}>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} />
        </Group>
      </Flex>{' '}
      <Flex mx={8} gap={'xs'} w={'100%'}>
        <Skeleton w={'20%'} circle height={'100%'} />{' '}
        <Group w={'80%'} gap={'0'}>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} />
        </Group>
      </Flex>{' '}
      <Flex mx={8} gap={'xs'} w={'100%'}>
        <Skeleton w={'20%'} circle height={'100%'} />{' '}
        <Group w={'80%'} gap={'0'}>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} />
        </Group>
      </Flex>{' '}
      <Flex mx={8} gap={'xs'} w={'100%'}>
        <Skeleton w={'20%'} circle height={'100%'} />{' '}
        <Group w={'80%'} gap={'0'}>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} />
        </Group>
      </Flex>{' '}
      <Flex mx={8} gap={'xs'} w={'100%'}>
        <Skeleton w={'20%'} circle height={'100%'} />{' '}
        <Group w={'80%'} gap={'0'}>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} />
        </Group>
      </Flex>{' '}
      <Flex mx={8} gap={'xs'} w={'100%'}>
        <Skeleton w={'20%'} circle height={'100%'} />{' '}
        <Group w={'80%'} gap={'0'}>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} />
        </Group>
      </Flex>{' '}
      <Flex mx={8} gap={'xs'} w={'100%'}>
        <Skeleton w={'20%'} circle height={'100%'} />{' '}
        <Group w={'80%'} gap={'0'}>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} />
        </Group>
      </Flex>{' '}
      <Flex mx={8} gap={'xs'} w={'100%'}>
        <Skeleton w={'20%'} circle height={'100%'} />{' '}
        <Group w={'80%'} gap={'0'}>
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} />
        </Group>
      </Flex>
    </>
  )
}

export const NoData = ({ message }) => {
  return (
    <Container p={'xl'} ta={'center'} mt={60}>
      <Text m={'md'} c="dimmed" size="md">
        <PiEmpty size={42} style={{ fontStyle: '' }} />
      </Text>
      <Title opacity={'0.7'} order={4}>
        لا يوجد بيانات لعرضها
      </Title>
      <Text mt={'md'} c="dimmed" size="md">
        قم بإنشاء عناصر جديدة ليتم عرضها هنا.
      </Text>
    </Container>
  )
}
