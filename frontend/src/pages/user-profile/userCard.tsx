import { Avatar, List, Skeleton } from "antd";
import Link from "antd/es/typography/Link";
import useRoleNavigate from "libs/role-navigate";

export default function UserCard({user,loading}:any){

    const navigate = useRoleNavigate()

    const handleViewAccount = (id:any) => {
        navigate(`/profile?id=${id}`)
    }
    return(
        <Skeleton loading={loading}>
        <List.Item>
        <List.Item.Meta
        avatar={
        <Link onClick={()=>handleViewAccount(user._id)}>
        <Avatar src={user.avatar} />
        </Link>
        }
        title={
        <Link onClick={()=>handleViewAccount(user._id)}>
        {user.username}
        </Link>
        }
        />    
        </List.Item> 
        </Skeleton>
        
    )
}