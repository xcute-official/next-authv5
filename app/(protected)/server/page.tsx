import { auth } from '@/auth'
import { UserInfo } from '@/components/user-info';
import { currentUser } from '@/lib/auth'


const page = async () => {
    const user = await currentUser();

  return (
    <div>
      <UserInfo user={user} label='Server component'/>
    </div>
  )
}

export default page