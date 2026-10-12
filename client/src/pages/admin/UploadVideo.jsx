import React, { useState } from 'react'
import axios from 'axios'
import {
  Text,
  Group,
  Progress,
  Button,
  Modal,
  rem,
  Center,
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import client from '../../api/client'
import { useDisclosure } from '@mantine/hooks'
import { useParams } from 'react-router-dom'
import { IconUpload, IconVideo, IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

const cloudName = 'ddng3kwfw'
const uploadPreset = 't01knn9d'

const getVideoDuration = (file, setDuration) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const blob = new Blob([event.target.result], { type: file.type })
      const video = document.createElement('video')
      video.src = URL.createObjectURL(blob)
      video.onloadedmetadata = () => {
        setDuration(video.duration)
      }
    }
    reader.readAsArrayBuffer(file)
  }
}

export default function UploadVideo({ children, sectionId, queryClient, lesson = {} }) {
  const { courseId } = useParams()
  const [opened, { open, close }] = useDisclosure(false)
  const [duration, setDuration] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (files) => {
    const file = files[0]
    getVideoDuration(file, setDuration)
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('upload_preset', uploadPreset)

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`

    try {
      const response = await axios.post(url, formData, {
        onUploadProgress: (event) => {
          if (event.total) {
            const percentCompleted = Math.round((event.loaded * 100) / event.total)
            setUploadProgress(percentCompleted)
          }
        },
      })

      const data = response.data
      if (data?.secure_url) {
        await client.patch(`sections/${sectionId}/lessons/${lesson._id}`, {
          video: {
            url: data.secure_url,
            duration: duration / 60,
          },
        })

        if (queryClient) {
          queryClient.invalidateQueries(['sections', courseId])
        }

        notifications.show({
          title: 'تم بنجاح',
          message: 'تم رفع الفيديو بنجاح',
          color: 'green',
        })
        close()
      }
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: 'فشل رفع الفيديو',
        color: 'red',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const isVideoAlreadyUploaded = Boolean(lesson.video?.url && lesson.video.url.length > 1)

  return (
    <>
      <Modal opened={opened} size="lg" onClose={close} title="رفع فيديو الدرس" centered>
        <Dropzone
          disabled={isVideoAlreadyUploaded}
          onDrop={handleFileChange}
          onReject={(files) => console.log('rejected files', files)}
          m="md"
          maxFiles={1}
          maxSize={100 * 1024 * 1024}
          accept={{ 'video/*': [] }}
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
                <IconVideo style={{ width: rem(48), height: rem(48) }} stroke={1.5} />
              </Center>
            </Dropzone.Idle>

            <div>
              <Text size="md" align="center">
                {isVideoAlreadyUploaded
                  ? 'تم رفع الفيديو مسبقاً'
                  : 'انقر لاختيار مقطع فيديو أو اسحب الملف هنا'}
              </Text>
              <Text size="xs" color="dimmed" align="center" mt={4}>
                الحد الأقصى 100 ميجابايت
              </Text>
            </div>
          </Group>
        </Dropzone>

        {uploadProgress > 0 && (
          <Progress m="md" value={uploadProgress} label={`${uploadProgress}%`} size="xl" radius="xl" />
        )}

        <Group position="apart" mt="lg">
          <Button variant="default" onClick={close}>
            إلغاء
          </Button>
          <Button
            onClick={handleUpload}
            loading={isUploading}
            disabled={!selectedFile || isVideoAlreadyUploaded}
          >
            بدء الرفع
          </Button>
        </Group>
      </Modal>

      <div onClick={open} style={{ display: 'inline-block', cursor: 'pointer' }}>
        {children}
      </div>
    </>
  )
}
