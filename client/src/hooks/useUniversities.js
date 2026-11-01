import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import universitiesApi from '../api/universities.api.js'
import { notifications } from '@mantine/notifications'

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
        title: 'تم بنجاح',
        message: 'تمت تهيئة الجامعة والحساب الإداري بنجاح',
        color: 'teal',
      })
    },
    onError: (err) => {
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'فشلت عملية تهيئة الجامعة'
      notifications.show({
        title: 'خطأ',
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
        title: 'تم بنجاح',
        message: 'تم تحديث بيانات الجامعة بنجاح',
        color: 'teal',
      })
    },
    onError: (err) => {
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'فشل التحديث'
      notifications.show({
        title: 'خطأ',
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
        title: 'تم تحديث الحالة',
        message: variables.active ? 'تم تفعيل حساب الجامعة بنجاح' : 'تم تعليق حساب الجامعة بنجاح',
        color: variables.active ? 'teal' : 'orange',
      })
    },
    onError: (err) => {
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'فشل تغيير حالة الجامعة'
      notifications.show({
        title: 'خطأ',
        message: msg,
        color: 'red',
      })
    },
  })
}
