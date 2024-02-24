// import CollageInfo from './CollageInfo'
import CollageInfo from './CollageInfo'
import React, { useState } from 'react'
import { Provider } from 'react-redux'
import store from '../../lib/store'

export default {
  component: CollageInfo,
  title: 'Screens/CollageInfo',
  tags: ['autodocs'],
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {
  const data = {
    collageInfo: {
      id: '1',
      name: 'Example College',
      fieldsNum: '5',
      describtion:
        'كلية جامعية هي مؤسسة تعليم عالي تقدم تعليماً جامعياً وبرامج بحثية في مجموعة متنوعة من التخصصات الأكاديمية. تعمل الكليات الجامعية على تطوير قدرات الطلاب وتحسين فهمهم في مجالات مختلفة، وتمنح درجات أكاديمية مثل البكالوريوس والماجستير والدكتوراه. تشمل الكليات مجموعة واسعة من الأقسام والتخصصات، وتوفر أيضاً بيئة للبحث العلمي والابتكار. تلعب الكليات الجامعية دورًا مهمًا في تحضير الطلاب لحياتهم المهنية وتسهم في تقدم المعرفة والتطور الاقتصادي والاجتماعي.',
    },
  }
  return <CollageInfo collageInfo={data.collageInfo} />
}
