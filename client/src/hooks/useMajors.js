import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import majorsApi from '../api/majors.api.js'
import { notifications } from '@mantine/notifications'

export function useMajors(params = {}) {
  return useQuery({
    queryKey: ['majors', params],
    queryFn: async () => {
      const res = await majorsApi.getMajors(params)
      return {
        data: res?.data || [],
        meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateMajor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => majorsApi.createMajor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم إضافة التخصص بنجاح',
        color: 'teal',
      })
    },
  })
}

export function useUpdateMajor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => majorsApi.updateMajor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم تحديث التخصص بنجاح',
        color: 'teal',
      })
    },
  })
}

export function useDeleteMajor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => majorsApi.deleteMajor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['majors'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم حذف التخصص بنجاح',
        color: 'teal',
      })
    },
  })
}
