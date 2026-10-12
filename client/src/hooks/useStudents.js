import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import studentsApi from '../api/students.api.js'
import { notifications } from '@mantine/notifications'

export function useStudents(params = {}) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: async () => {
      const res = await studentsApi.getStudents(params)
      return {
        data: res?.data || [],
        meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => studentsApi.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم إضافة الطالب بنجاح',
        color: 'teal',
      })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => studentsApi.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم تحديث بيانات الطالب بنجاح',
        color: 'teal',
      })
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => studentsApi.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم حذف الطالب بنجاح',
        color: 'teal',
      })
    },
  })
}
