import React, { useState } from 'react'
import axios from 'axios'

import {
  Text,
  Image,
  SimpleGrid,
  Group,
  Progress,
  Button,
  Modal,
  ThemeIcon,
  Center,
  rem,
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import customFetch from '../../utils/customFetch'
import { useDisclosure } from '@mantine/hooks'
import { useParams } from 'react-router-dom'
import { IconFile, IconPhoto, IconUpload, IconVideo, IconX } from '@tabler/icons-react'

// import Progress from 'progress'; // Progress library for visual feedback
const cloudName = 'ddng3kwfw'
const uploadPreset = 't01knn9d'

const getVieoDuration = (file, set) => {
  let duration = 0
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const blob = new Blob([event.target.result], { type: file.type })
      const video = document.createElement('video')
      video.src = URL.createObjectURL(blob)
      video.onloadedmetadata = () => {
        set(video.duration)
      }
    }
    reader.readAsArrayBuffer(file)
  }
}
export default function UploadVideo({ children, sectionId, queryClient, lesson }) {
  const { id } = useParams()
  const [opened, { open, close }] = useDisclosure(false)
  const [duration, setDuration] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [theUrl, setTheUrl] = useState('')

  const [uploadProgress, setUploadProgress] = useState(0)




  const handleFileChange = (e) => {
    const file = e[0]
    getVieoDuration(file, setDuration)
    setSelectedFile(file)
  }

  console.log('dur', duration)

  const handleUpload = async () => {
    if (!selectedFile) return

    const formData = new FormData()

    formData.append('file', selectedFile)
    formData.append('upload_preset', uploadPreset)

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`

    try {
      const response = await axios.post(url, formData, {
        // headers,

        onUploadProgress: (event) => {
          const percentCompleted = Math.round((event.loaded * 100) / event.total)
          setUploadProgress(percentCompleted)
          console.log(percentCompleted) // Update progress bar
        },
      })
      const { data } = response
      if (data) {
        const vid_url = data.secure_url

        await customFetch.patch(`sections/${sectionId}/lessons/${lesson._id}`, {
          video: {
            url: vid_url,
            duration: duration / 60,
          },
        })
        queryClient.invalidateQueries(['sections', id])

        // close()
      }
    } catch (error) {
      console.error(error)
    } finally {
      // progress.terminate(); // Clear progress bar
    }
  }




  return (
    <>
      <Modal opened={opened} size={'xl'} onClose={close} title="رفع محاضرة الدرس" centered>
        <Dropzone
        disabled={lesson.video.url.length>1}
          onDrop={handleFileChange}
          onReject={(files) => console.log('rejected files', files)}
          m={'md'}
          maxFiles={1}
          maxSize={100 * 1024 * 1024}
          accept={'video/*'}
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
                <IconVideo
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

          {uploadProgress > 0 ? (
            <>
              {' '}
              <Progress m={'md'} value={uploadProgress}>
                {' '}
                <Progress.Section value={35} color="cyan">
                  <Progress.Label>يتم التحميل...{uploadProgress}</Progress.Label>
                </Progress.Section>
              </Progress>
            </>
          ) : (
            ''
          )}
        </Dropzone>
        <Group>
          <Button fullWidth m={'md'} type="button" onClick={handleUpload} disabled={!selectedFile}>
            رفع المقطع
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
