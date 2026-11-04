import React, { useState } from 'react'
import { Text, Image, Group, Button, Modal, rem, Center } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import customFetch from '../../utils/customFetch'
import { useDisclosure } from '@mantine/hooks'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { uploadMedia } from '../../utils/mediaUpload'

export default function UploadProfile({ children, queryClient, user }) {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { t } = useTranslation(['auth', 'common'])

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
      <Modal
        opened={opened}
        size="lg"
        onClose={close}
        title={t('profile.avatarUploadModal', { ns: 'auth' })}
        centered
      >
        <Dropzone
          onReject={(files) => console.log('rejected files', files)}
          m="md"
          maxFiles={1}
          accept={{ 'image/*': [] }}
          onDrop={handleFileChange}
        >
          <Group position="center" spacing="xl" mih={180} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(48), height: rem(48), color: 'var(--mantine-color-blue-6)' }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(48), height: rem(48), color: 'var(--mantine-color-red-6)' }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Center display="block">
                <IconPhoto
                  style={{ width: rem(48), height: rem(48), color: 'var(--mantine-color-dimmed)' }}
                  stroke={1.5}
                />
              </Center>
            </Dropzone.Idle>

            <div>
              <Text size="md" weight={600} inline>
                {t('profile.avatarDropzoneText', { ns: 'auth' })}
              </Text>
              <Text size="xs" color="dimmed" inline mt={7}>
                {t('profile.avatarDropzoneHint', { ns: 'auth' })}
              </Text>
            </div>
          </Group>

          {selectedFile && previews()}
        </Dropzone>
        <Group>
          <Button fullWidth m="md" type="button" onClick={handleUpload} loading={isUploading} disabled={!selectedFile}>
            {t('profile.uploadAvatar', { ns: 'auth' })}
          </Button>
        </Group>
        <Group position="right" mt="lg">
          <Button variant="default" onClick={close}>{t('actions.cancel', { ns: 'common' })}</Button>
        </Group>
      </Modal>
      <Group onClick={open} position="center">
        {children}
      </Group>
    </>
  )
}
