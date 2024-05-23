import React, { useState } from 'react'
import axios from 'axios'

import { Text, Image, SimpleGrid, Group, Progress, Button, Modal } from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import customFetch from '../../utils/customFetch'
import { useDisclosure } from '@mantine/hooks'
import { useParams } from 'react-router-dom'

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
      <Modal opened={opened} size={'xl'} onClose={close} title="" centered>
        {/* <Group  position="center"> */}
        <Dropzone
          maxFiles={1}
          maxSize={100 * 1024 * 1024}
          accept={{ 'video/*': [] }}
          onDrop={handleFileChange}
        >
          <Text align="center">Drop images here</Text>
        </Dropzone>
        {uploadProgress > 0 ? (
          <>
            {' '}
            <Text>uploading...</Text>
            <Progress value={uploadProgress} />
          </>
        ) : (
          ''
        )}

        <Button type="button" onClick={handleUpload} disabled={!selectedFile}>
          Upload Video
        </Button>
        {/* </Group> */}
        <Group>
          <Button onClick={close}>Save</Button>
          <Button>Cancel</Button>
        </Group>
      </Modal>
      <Group onClick={open} position="center">
        {children}{' '}
      </Group>
    </>
  )
}
