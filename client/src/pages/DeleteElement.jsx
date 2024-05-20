import { Button, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
// import { useDeleteElement } from './crud'
import { notifications } from '@mantine/notifications'
import { useDeleteElement } from './crud'

export default function DeleteElement(queryClient, elementId, collection, withConfirm = false) {
  const { mutateAsync: deleteElement, isLoading: isLoading } = useDeleteElement(
    queryClient,
    collection,
  )

  const handleDelete = async () => {
    console.log('values')
    console.log(elementId)
    try {
      await deleteElement(elementId)
      //   console.log(res)
      // notifications.show({
      //   id: 'collage-created',
      //   title: 'Success!',
      //   message: 'Collage created successfully!',
      //   variant: 'success',
      //   autoClose: 5000,
      // })
    } catch (error) {
      console.log(error)
      notifications.show({
        id: 'collage-creation-error',
        title: 'Error!',
        message: error?.response?.data?.msg || 'An error occurred while creating the collage.',
        variant: 'danger',
        autoClose: 5000,
      })
    }
  }

  // if (withConfirm) {
  //   // confirmModal(handleDelete)
  // } else {
  //   handleDelete()
  // }

  handleDelete()

}

const confirmModal = (handleConfirm) =>
  modals.openConfirmModal({
    title: 'Please confirm your action',
    children: (
      <Text size="sm">
        This action is so important that you are required to confirm it with a modal. Please click
        one of these buttons to proceed.
      </Text>
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onCancel: () => console.log('Cancel'),
    onConfirm: handleConfirm,
  })


