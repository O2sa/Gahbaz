import React from 'react'
import { useForm } from '@mantine/form'
import { TextInput, Button, Group, Modal, NumberInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useCreateElement } from '../crud'

export default function AddCollage({ queryClient }) {
  const { t } = useTranslation(['admin', 'common', 'errors'])
  const { mutateAsync: createCollage, isPending: isCreatingCollage } = useCreateElement(
    queryClient,
    ['collages'],
  )
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: '',
      numberOfSemesters: 8,
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
      await createCollage(values)
      handleCloseModal()
      notifications.show({
        id: 'collage-created',
        title: t('common:confirmModalTitle'),
        message: t('common:createSuccess'),
        variant: 'success',
        autoClose: 5000,
      })
    } catch (error) {
      notifications.show({
        id: 'collage-creation-error',
        title: t('common:actions.error', { defaultValue: 'خطأ' }),
        message: error?.response?.data?.msg || t('errors:generic', { defaultValue: 'حدث خطأ أثناء إنشاء الكلية' }),
        variant: 'danger',
        autoClose: 5000,
      })
    }
  }

  return (
    <Group position="center">
      <Modal centered title={t('colleges.createTitle')} opened={opened} onClose={close}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label={t('colleges.name')}
            name="name"
            placeholder={t('colleges.namePlaceholder')}
            error={form.errors.name}
            {...form.getInputProps('name')}
          />
          <NumberInput
            mt="sm"
            error={form.errors.numberOfSemesters}
            label={t('colleges.numberOfSemesters')}
            placeholder={t('colleges.numberOfSemesters')}
            min={1}
            {...form.getInputProps('numberOfSemesters')}
            withAsterisk
          />
          <Group position="right" mt="md">
            <Button type="submit" loading={isCreatingCollage}>
              {t('actions.create', { ns: 'common' })}
            </Button>
          </Group>
        </form>
      </Modal>
      <Group onClick={open}>
        <Button radius="xs">{t('colleges.createTitle')}</Button>
      </Group>
    </Group>
  )
}
