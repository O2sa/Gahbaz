import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import semestersApi from '../api/semesters.api.js'
import { notifications } from '@mantine/notifications'

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
        title: 'تم بنجاح',
        message: 'تم إنشاء الفصل الدراسي بنجاح',
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
        title: 'تم بنجاح',
        message: 'تم تحديث الفصل الدراسي بنجاح',
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
        title: 'تم بنجاح',
        message: 'تم حذف الفصل الدراسي بنجاح',
        color: 'teal',
      })
    },
  })
}
