import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import semestersApi from '../api/semesters.api.js'
import { notifications } from '@mantine/notifications'
import i18n from '../i18n'

export function useSemesters(params = {}) {
  return useQuery({
    queryKey: ['semesters', params],
    queryFn: async () => {
      const res = await semestersApi.getSemesters(params)
      return {
        data: res?.data || [],
        meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateSemester() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => semestersApi.createSemester(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] })
      notifications.show({
        title: i18n.t('notifications.success', { ns: 'common', defaultValue: 'تم بنجاح' }),
        message: i18n.t('notifications.createSuccess', { ns: 'common', defaultValue: 'تم إنشاء الفصل الدراسي بنجاح' }),
        color: 'teal',
      })
    },
  })
}

export function useUpdateSemester() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => semestersApi.updateSemester(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] })
      notifications.show({
        title: i18n.t('notifications.success', { ns: 'common', defaultValue: 'تم بنجاح' }),
        message: i18n.t('notifications.updateSuccess', { ns: 'common', defaultValue: 'تم تحديث الفصل الدراسي بنجاح' }),
        color: 'teal',
      })
    },
  })
}

export function useDeleteSemester() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => semestersApi.deleteSemester(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] })
      notifications.show({
        title: i18n.t('notifications.success', { ns: 'common', defaultValue: 'تم بنجاح' }),
        message: i18n.t('notifications.deleteSuccess', { ns: 'common', defaultValue: 'تم حذف الفصل الدراسي بنجاح' }),
        color: 'teal',
      })
    },
  })
}

export function useStartSemester() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => semestersApi.startSemester(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      notifications.show({
        title: i18n.t('semesters.launchSuccessTitle', { ns: 'admin', defaultValue: 'تم إطلاق الفصل الدراسي بنجاح تام!' }),
        message: i18n.t('semesters.launchSuccessMessage', { ns: 'admin', defaultValue: 'تم توليد الشعب الأكاديمية وتسجيل الطلاب المؤهلين آلياً.' }),
        color: 'teal',
      })
    },
  })
}

export function useSemesterTemplatesByMajor(majorId) {
  return useQuery({
    queryKey: ['semester-templates', 'major', majorId],
    queryFn: async () => {
      if (!majorId) return []
      const res = await semestersApi.getTemplatesByMajor(majorId)
      return Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
    },
    enabled: Boolean(majorId),
    staleTime: 1000 * 60 * 5,
  })
}


