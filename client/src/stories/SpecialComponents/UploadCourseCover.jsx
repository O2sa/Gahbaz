import React, { useState } from 'react'
import axios from 'axios'

import { Text, Image, SimpleGrid, Group, Progress, Button, Modal, rem, Center } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import customFetch from '../../utils/customFetch'
import { useDisclosure } from '@mantine/hooks'
import { useParams } from 'react-router-dom'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'

// import Progress from 'progress'; // Progress library for visual feedback
const cloudName = 'ddng3kwfw'
const uploadPreset = 't01knn9d'

export default function UploadCourseCover({ children, queryClient }) {
  const { courseId } = useParams()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (e) => {
    const file = e[0]
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    const formData = new FormData()

    formData.append('file', selectedFile)
    formData.append('upload_preset', uploadPreset)

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`

    try {
      const response = await axios.post(url, formData, {})
      const { data } = response
      if (data) {
        const url = data.secure_url

        await customFetch.patch(`courses/${courseId}`, {
          cover: url,
        })
        queryClient.invalidateQueries(['courses', courseId])

        // close()
      }
    } catch (error) {
      console.error(error)
    } finally {
      // progress.terminate(); // Clear progress bar
    }
  }

  const previews = () => {
    const imageUrl = URL.createObjectURL(selectedFile)
    return <Image src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
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
          <Button fullWidth m={'md'} type="button" onClick={handleUpload} disabled={!selectedFile}>
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
