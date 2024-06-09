import { notifications } from '@mantine/notifications'

export const getNotfication = (sucess = true, message) => {
  if (sucess) {
    notifications.show({
      id: 'sucess',
      title: 'تمت!',
      message: message || 'تمت العملية',
      variant: 'success',
      color: 'green',
      autoClose: 5000,
    })
  } else {
    notifications.show({
      id: 'error-delete',
      title: 'خطأ!',
      message: message || 'فشلت العملية',
      variant: 'error',
      color: 'red',
      autoClose: 5000,
    })
  }
}
