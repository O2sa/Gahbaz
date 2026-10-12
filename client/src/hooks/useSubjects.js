import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import subjectsApi from '../api/subjects.api.js'
import { notifications } from '@mantine/notifications'

export function useSubjects(params = {}) {
  return useQuery({
    queryKey: ['subjects', params],
    queryFn: async () => {
      const res = await subjectsApi.getSubjects(params)
      return {
        data: res?.data || [],
        meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => subjectsApi.createSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم إضافة المادة الدراسية بنجاح',
        color: 'teal',
      })
    },
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => subjectsApi.updateSubject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم تحديث المادة الدراسية بنجاح',
        color: 'teal',
      })
    },
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => subjectsApi.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم حذف المادة الدراسية بنجاح',
        color: 'teal',
      })
    },
  })
}
