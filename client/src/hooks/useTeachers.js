import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import teachersApi from '../api/teachers.api.js'
import { notifications } from '@mantine/notifications'

export function useTeachers(params = {}) {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: async () => {
      const res = await teachersApi.getTeachers(params)
      return {
        data: res?.data || [],
        meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => teachersApi.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم إضافة الأستاذ بنجاح',
        color: 'teal',
      })
    },
  })
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => teachersApi.updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم تحديث بيانات الأستاذ بنجاح',
        color: 'teal',
      })
    },
  })
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => teachersApi.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم حذف الأستاذ بنجاح',
        color: 'teal',
      })
    },
  })
}
