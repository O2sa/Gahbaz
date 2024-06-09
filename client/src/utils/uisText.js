// export default UI_TEXT = {
//   words: {
//     al: 'ال',
//     majors: 'تخصصات',
//     major: 'تخصص',
//     universties: 'جامعات',
//     universty: 'جامعة',
//     coures: 'دورة',
//     coure: 'دورات',
//     lesson: 'درس',
//     lessons: 'دروس',
//     subject: 'طالب',
//     subjects: 'طلاب',
//     teachers: 'استاذ',
//     teacher: 'أساتذة',
//     semester: 'فصل',
//     semesters: 'فصول',
//     error: 'خطأ',
//     data: 'بيانات',
//     admin: 'مدير',
//     admins: 'مدراء',
//     user: 'مستخدم',
//     users: 'مستخدمون',
//     try: 'حاول',
//     again: 'مرة أخرى',
//     account: 'حساب',
//     save: 'حفظ',
//     cancel: 'إلغاء',
//     back: 'رجوع',
//     study: 'دراسة',
//     review: 'مراجعة',
//     panel: 'لوحة',
//     control: 'تحكم',
//     collage: 'كلية',
//     collages: 'كليات',
//   },

//   statments: {
//     sign_in: '',
//     forget_your_pass: '',
//     sign_up: '',
//     sign_in: '',
//     sign_in: '',
//     sign_in: '',
//     sign_in: '',
//     sign_in: '',
//     sign_in: '',
//   },
// }

export function replaceHTML(htmlContent) {
  // Extract text content from HTML
  const textContent = htmlContent?.replace(/<[^>]+>/g, '') // Remove HTML tags

  return textContent
}
