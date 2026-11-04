import React from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { TextInput, Button, Group, Modal } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useUpdateElement } from '../crud'

export default function EditSubject({ queryClient, data = {}, component }) {
  const { id: collageId } = useParams()
  const { t } = useTranslation(['admin', 'common', 'errors'])

  const { mutateAsync: updateSubject, isPending: isUpdatingSubject } = useUpdateElement(
    queryClient,
    ['subjects', collageId],
  )
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: data.name || '',
      subtitle: data.subtitle || '',
      category: data.category || '',
      _id: data._id,
    },
    validate: (values) => {
      const errors = {}
      if (!values.name?.trim()) {
        errors.name = t('subjects.validation.nameRequired')
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
      await updateSubject(values)
      handleCloseModal()
      notifications.show({
        id: 'subject-updated',
        title: t('common:confirmModalTitle'),
        message: t('common:updateSuccess'),
        variant: 'success',
        autoClose: 5000,
      })
    } catch (error) {
      notifications.show({
        id: 'subject-update-error',
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: error?.response?.data?.msg || t('errors:generic', { defaultValue: 'حدث خطأ أثناء تعديل المادة' }),
        variant: 'danger',
        autoClose: 5000,
      })
    }
  }

  return (
    <Group position="center">
      <Modal centered title={t('subjects.editTitle')} opened={opened} onClose={close}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label={t('subjects.name')}
            name="name"
            placeholder={t('subjects.namePlaceholder')}
            error={form.errors.name}
            {...form.getInputProps('name')}
          />
          <TextInput
            mt="sm"
            label={t('subjects.subjectSubtitle')}
            name="subtitle"
            placeholder={t('subjects.subtitlePlaceholder')}
            {...form.getInputProps('subtitle')}
          />
          <TextInput
            mt="sm"
            label={t('subjects.subjectCategory')}
            name="category"
            placeholder={t('subjects.categoryPlaceholder')}
            {...form.getInputProps('category')}
          />
          <Group position="right" mt="md">
            <Button type="submit" loading={isUpdatingSubject}>
              {t('actions.save', { ns: 'common' })}
            </Button>
          </Group>
        </form>
      </Modal>
      <Group onClick={open}>{component}</Group>
    </Group>
  )
}
