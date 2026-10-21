import React, { useState } from 'react'
import axios from 'axios'
import {
  Text,
  Image,
  Group,
  Button,
  Modal,
  rem,
  Center,
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import client from '../../api/client'
import { useDisclosure } from '@mantine/hooks'
import { useParams } from 'react-router-dom'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { uploadMedia } from '../../utils/mediaUpload'

export default function UploadCourseCover({ children, queryClient }) {
  const { courseId } = useParams()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (files) => {
    const file = files[0]
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)

    try {
      const media = await uploadMedia(selectedFile, { folder: 'covers' })
      if (media?.url) {
        await client.patch(`courses/${courseId}`, {
          cover: media.url,
        })
        if (queryClient) {
          queryClient.invalidateQueries(['courses', courseId])
        }
        notifications.show({
          title: 'تم بنجاح',
          message: 'تم تحديث غلاف الدورة بنجاح',
          color: 'green',
        })
        close()
      }
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: 'فشل تحميل غلاف الدورة',
        color: 'red',
      })
    } finally {
      setIsUploading(false)
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
        mt="md"
        radius="md"
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    )
  }

  return (
    <>
      <Modal opened={opened} size="lg" onClose={close} title="تحميل غلاف الدورة" centered>
        <Dropzone
          onReject={(files) => console.log('rejected files', files)}
          m="md"
          maxFiles={1}
          accept={{ 'image/*': [] }}
          onDrop={handleFileChange}
        >
          <Group position="center" spacing="xl" style={{ minHeight: 180, pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload style={{ width: rem(48), height: rem(48) }} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX style={{ width: rem(48), height: rem(48) }} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Center>
                <IconPhoto style={{ width: rem(48), height: rem(48) }} stroke={1.5} />
              </Center>
            </Dropzone.Idle>

            <div>
              <Text size="md" align="center">
                انقر لاختيار صورة أو اسحب الصورة هنا
              </Text>
              <Text size="xs" color="dimmed" align="center" mt={4}>
                الحد الأقصى 5 ميجابايت
              </Text>
            </div>
          </Group>

          {previews()}
        </Dropzone>

        <Group position="apart" mt="lg">
          <Button variant="default" onClick={close}>
            إلغاء
          </Button>
          <Button onClick={handleUpload} loading={isUploading} disabled={!selectedFile}>
            رفع وحفظ
          </Button>
        </Group>
      </Modal>

      <div onClick={open} style={{ display: 'inline-block', cursor: 'pointer' }}>
        {children}
      </div>
    </>
  )
}
