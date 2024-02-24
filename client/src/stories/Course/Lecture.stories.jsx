import { Lecture } from './Lecture'
import { AiTwotoneCheckSquare } from "react-icons/ai";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { BiSolidVideos } from "react-icons/bi";
import { IoIosPause } from "react-icons/io";
import { PiPlayPauseFill } from "react-icons/pi";
import { IoMdTime } from "react-icons/io";
Lecture

export default {
  component: Lecture,
  title: 'Lecture',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {
 const teachers=[
    {
        name:'أحمد علي قاسم عبدالله',
        id:'09348984'
    },    {
        name:'أحمد علي قاسم عبدالله',
        id:'09348984'
    },
 ]
  return (
    <>
      <Lecture items={teachers} />
    </>
  )
}
