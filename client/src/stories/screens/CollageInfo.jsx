import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { asyncCrudThunks } from 'src/dataLogic/CollageManagementSlice.mjs'
import { Tabs } from '../Tabs/Tabs'
import { TabsBody } from '../Tabs/TabsBody'
import stackIcon from '../assets/Stack.svg'

import CardsGroup from '../SpecialComponents/CardsGroup'
import { AddCollage } from './AddCollage'
import { AddField } from './AddField'
import { useParams } from 'react-router-dom'

export default function CollageInfo({
  collageInfo = {
    id: '1',
    name: 'Example College',
    fieldsNum: '5',
    describtion:
      'كلية جامعية هي مؤسسة تعليم عالي تقدم تعليماً جامعياً وبرامج بحثية في مجموعة متنوعة من التخصصات الأكاديمية. تعمل الكليات الجامعية على تطوير قدرات الطلاب وتحسين فهمهم في مجالات مختلفة، وتمنح درجات أكاديمية مثل البكالوريوس والماجستير والدكتوراه. تشمل الكليات مجموعة واسعة من الأقسام والتخصصات، وتوفر أيضاً بيئة للبحث العلمي والابتكار. تلعب الكليات الجامعية دورًا مهمًا في تحضير الطلاب لحياتهم المهنية وتسهم في تقدم المعرفة والتطور الاقتصادي والاجتماعي.',
  },
}) {

  const tabs = [
    {
      name: 'معلومات الكلية',
      icon: stackIcon,
      to: '.',
    },
    {
      name: 'التخصصات',
      icon: stackIcon,
      to: 'fields',
    },
    {
      name: 'المواد',
      icon: stackIcon,
      to: 'subjects',
    },
  ]

  return <Tabs tabs={tabs} />
}
