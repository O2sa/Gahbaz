import React from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput, Button, Group, Modal } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useUpdateElement } from '../crud'

export default function EditMajor({ queryClient, data = {}, component }) {
  const { id: collageId } = useParams()
  const { t } = useTranslation(['admin', 'common', 'errors'])

  const { mutateAsync: updateMajor, isPending: isUpdatingMajor } = useUpdateElement(
    queryClient,
    ['majors', collageId],
  )
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: data.name || '',
      _id: data._id,
    },
    validate: (values) => {
      const errors = {}
      if (!values.name?.trim()) {
        errors.name = t('majors.validation.nameRequired')
      }
      return errors
    },
  })

  const handleCloseModal = () => {
    close()
    form.reset()
  }

  const handleSubmit = async (values) => {
    try {
      await updateMajor(values)
      handleCloseModal()
      notifications.show({
        id: 'major-updated',
        title: t('common:confirmModalTitle'),
        message: t('common:updateSuccess'),
        variant: 'success',
        autoClose: 5000,
      })
    } catch (error) {
      notifications.show({
        id: 'major-update-error',
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: error?.response?.data?.msg || t('errors:generic', { defaultValue: 'حدث خطأ أثناء تعديل التخصص' }),
        variant: 'danger',
        autoClose: 5000,
      })
    }
  }

  return (
    <Group position="center">
      <Modal centered title={t('majors.editTitle')} opened={opened} onClose={close}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label={t('majors.name')}
            name="name"
            placeholder={t('majors.namePlaceholder')}
            error={form.errors.name}
            {...form.getInputProps('name')}
          />
          <Group position="right" mt="md">
            <Button type="submit" loading={isUpdatingMajor}>
              {t('actions.save', { ns: 'common' })}
            </Button>
          </Group>
        </form>
      </Modal>
      <Group onClick={open}>{component}</Group>
    </Group>
  )
}
