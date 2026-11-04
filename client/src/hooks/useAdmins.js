import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import adminsApi from '../api/admins.api.js'
import { notifications } from '@mantine/notifications'
import i18n from '../i18n'

export function useAdmins(params = {}) {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: async () => {
      const res = await adminsApi.getAdmins(params)
      return {
        data: res?.data || [],
        meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => adminsApi.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      notifications.show({
        title: i18n.t('notifications.success', { ns: 'common', defaultValue: 'تم بنجاح' }),
        message: i18n.t('notifications.createSuccess', { ns: 'common', defaultValue: 'تم إضافة المدير بنجاح' }),
        color: 'teal',
      })
    },
  })
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => adminsApi.updateAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      notifications.show({
        title: i18n.t('notifications.success', { ns: 'common', defaultValue: 'تم بنجاح' }),
        message: i18n.t('notifications.updateSuccess', { ns: 'common', defaultValue: 'تم تحديث بيانات المدير بنجاح' }),
        color: 'teal',
      })
    },
  })
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => adminsApi.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      notifications.show({
        title: i18n.t('notifications.success', { ns: 'common', defaultValue: 'تم بنجاح' }),
        message: i18n.t('notifications.deleteSuccess', { ns: 'common', defaultValue: 'تم حذف المدير بنجاح' }),
        color: 'teal',
      })
    },
  })
}
