import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import collegesApi from '../api/colleges.api.js'
import { notifications } from '@mantine/notifications'

export function useColleges(params = {}) {
  return useQuery({
    queryKey: ['colleges', params],
    queryFn: async () => {
      const res = await collegesApi.getColleges(params)
      return {
        data: res?.data || [],
        meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateCollege() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => collegesApi.createCollege(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم إضافة الكلية بنجاح',
        color: 'teal',
      })
    },
  })
}

export function useUpdateCollege() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => collegesApi.updateCollege(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم تحديث الكلية بنجاح',
        color: 'teal',
      })
    },
  })
}

export function useDeleteCollege() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => collegesApi.deleteCollege(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] })
      notifications.show({
        title: 'تم بنجاح',
        message: 'تم حذف الكلية بنجاح',
        color: 'teal',
      })
    },
  })
}
