import React, { useState } from 'react'
import axios from 'axios'

import { Text, Image, SimpleGrid, Group, Progress, Button, Modal, rem, Center } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import customFetch from '../../utils/customFetch'
import { useDisclosure } from '@mantine/hooks'
import { useParams } from 'react-router-dom'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'

import { uploadMedia } from '../../utils/mediaUpload'

export default function UploadProfile({ children, queryClient, user }) {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e) => {
    const file = e[0]
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)

    try {
      const media = await uploadMedia(selectedFile, {
        folder: 'avatars',
        onProgress: setUploadProgress,
      })
      if (media?.url) {
        await customFetch.patch(`users/${user._id}`, {
          avatar: media.url,
        })
        if (queryClient) {
          queryClient.invalidateQueries(['users', 'current-user'])
        }
        close()
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const previews = () => {
    if (!selectedFile) return null
    const imageUrl = URL.createObjectURL(selectedFile)
    return (
      <Image
        src={imageUrl}
        height={180}
        fit="cover"
        radius="md"
        mt="md"
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    )
  }

  return (
    <>
      <Modal opened={opened} size={'xl'} onClose={close} title="Authentication" centered>
        <Dropzone
          onReject={(files) => console.log('rejected files', files)}
          m={'md'}
          maxFiles={1}
          // maxSize={2 * 1024 * 1024}
          accept={{ 'image/*': [] }}
          onDrop={handleFileChange}
        >
          <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Center display={'block'}>
                <IconPhoto
                  style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                  stroke={1.5}
                />
              </Center>
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                انقر لاختير مقطع من القرص المحلي أو قم بسحب وافلات الملف المراد رفعه
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed 5mb
              </Text>
            </div>
          </Group>

          {selectedFile && previews()}
        </Dropzone>
        <Group>
          <Button fullWidth m={'md'} type="button" onClick={handleUpload} loading={isUploading} disabled={!selectedFile}>
            رفع الصورة
          </Button>
        </Group>
        <Group align="flex-end" mt={'lg'}>
          <Button onClick={close}>حفظ</Button>
          <Button onClick={close}>إلغاء</Button>
        </Group>
      </Modal>
      <Group onClick={open} position="center">
        {children}{' '}
      </Group>
    </>
  )
}
