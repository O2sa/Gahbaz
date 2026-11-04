import React from 'react'
import { useForm } from '@mantine/form'
import { TextInput, Button, Group, Modal } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useUpdateElement } from '../crud'

export default function EditCollage({ queryClient, data = {}, component }) {
  const { t } = useTranslation(['admin', 'common', 'errors'])
  const { mutateAsync: updateCollage, isPending: isUpdatingCollage } = useUpdateElement(
    queryClient,
    ['collages'],
  )
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: data.name || '',
    },
    validate: (values) => {
      const errors = {}
      if (!values.name?.trim()) {
        errors.name = t('colleges.validation.nameRequired')
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
      await updateCollage({ ...data, ...values })
      handleCloseModal()
      notifications.show({
        id: 'collage-updated',
        title: t('common:confirmModalTitle'),
        message: t('common:updateSuccess'),
        variant: 'success',
        autoClose: 5000,
      })
    } catch (error) {
      notifications.show({
        id: 'collage-update-error',
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: error?.response?.data?.msg || t('errors:generic', { defaultValue: 'حدث خطأ أثناء تعديل الكلية' }),
        variant: 'danger',
        autoClose: 5000,
      })
    }
  }

  return (
    <Group position="center">
      <Modal centered title={t('colleges.editTitle')} opened={opened} onClose={close}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label={t('colleges.name')}
            name="name"
            placeholder={t('colleges.namePlaceholder')}
            error={form.errors.name}
            {...form.getInputProps('name')}
          />
          <Group position="right" mt="md">
            <Button type="submit" loading={isUpdatingCollage}>
              {t('actions.save', { ns: 'common' })}
            </Button>
          </Group>
        </form>
      </Modal>
      <Group onClick={open}>{component}</Group>
    </Group>
  )
}
