import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import universitiesApi from '../api/universities.api.js'
import { notifications } from '@mantine/notifications'
import i18n from '../i18n'

export function useUniversities(params = {}) {
  return useQuery({
    queryKey: ['universities', params],
    queryFn: async () => {
      const res = await universitiesApi.getUniversities(params)
      return {
        universities: res?.universities || [],
        meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  })
}

export function useUniversity(id) {
  return useQuery({
    queryKey: ['university', id],
    queryFn: async () => {
      const res = await universitiesApi.getUniversity(id)
      return res?.university
    },
    enabled: Boolean(id),
  })
}

export function useCreateUniversity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => universitiesApi.createUniversity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] })
      notifications.show({
        title: i18n.t('notifications.success', { ns: 'common', defaultValue: 'تم بنجاح' }),
        message: i18n.t('universities.createSuccess', { ns: 'admin', defaultValue: 'تمت تهيئة الجامعة والحساب الإداري بنجاح' }),
        color: 'teal',
      })
    },
    onError: (err) => {
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || i18n.t('universities.createFailed', { ns: 'admin', defaultValue: 'فشلت عملية تهيئة الجامعة' })
      notifications.show({
        title: i18n.t('notifications.error', { ns: 'common', defaultValue: 'خطأ' }),
        message: msg,
        color: 'red',
      })
    },
  })
}

export function useUpdateUniversity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => universitiesApi.updateUniversity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] })
      notifications.show({
        title: i18n.t('notifications.success', { ns: 'common', defaultValue: 'تم بنجاح' }),
        message: i18n.t('universities.updateSuccess', { ns: 'admin', defaultValue: 'تم تحديث بيانات الجامعة بنجاح' }),
        color: 'teal',
      })
    },
    onError: (err) => {
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || i18n.t('universities.updateFailed', { ns: 'admin', defaultValue: 'فشل التحديث' })
      notifications.show({
        title: i18n.t('notifications.error', { ns: 'common', defaultValue: 'خطأ' }),
        message: msg,
        color: 'red',
      })
    },
  })
}

export function useToggleUniversityStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }) => universitiesApi.toggleUniversityStatus(id, active),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['universities'] })
      notifications.show({
        title: i18n.t('universities.statusUpdated', { ns: 'admin', defaultValue: 'تم تحديث الحالة' }),
        message: variables.active
          ? i18n.t('universities.activatedSuccess', { ns: 'admin', defaultValue: 'تم تفعيل حساب الجامعة بنجاح' })
          : i18n.t('universities.suspendedSuccess', { ns: 'admin', defaultValue: 'تم تعليق حساب الجامعة بنجاح' }),
        color: variables.active ? 'teal' : 'orange',
      })
    },
    onError: (err) => {
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || i18n.t('universities.statusFailed', { ns: 'admin', defaultValue: 'فشل تغيير حالة الجامعة' })
      notifications.show({
        title: i18n.t('notifications.error', { ns: 'common', defaultValue: 'خطأ' }),
        message: msg,
        color: 'red',
      })
    },
  })
}
