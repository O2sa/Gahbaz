import { GrFormClose } from 'react-icons/gr'
import { Badge } from '@mantine/core'
function UserBage({ user, handleFunction, admin }) {
  return (
    // <div className="user-badge-item">
    //     {`${user.firstName} ${user.lastName}`}
    //     {admin._id === user._id
    //         ? <span> (Admin)</span>
    //         : <button onClick={handleFunction}>
    //             <GrFormClose />
    //         </button>
    //     }
    // </div>
    <Badge rightSection={admin._id !== user._id ? <GrFormClose onClick={handleFunction} /> : ''}>{`${
      user.firstName
    } ${user.lastName}${admin._id === user._id ? '(Admin)' : ''}`}</Badge>
  )
}

export default UserBage
