import { Avatar, List } from "antd";
import Link from "antd/es/typography/Link";
import useRoleNavigate from "libs/role-navigate";

export default function UserCard({ user, loading }: any) {

    const navigate = useRoleNavigate()

    const handleViewAccount = (id: any) => {
        navigate(`/profile?id=${id}`)
    }
    return (
            <List.Item style={{padding:'10px 0px 0px 30px'}}>
                <List.Item.Meta
                    avatar={
                        <Link onClick={() => handleViewAccount(user._id)}>
                            <Avatar src={user.avatar} />
                        </Link>
                    }
                    title={
                        <Link style={{ color: '#ecf0f1' }} onClick={() => handleViewAccount(user._id)}>
                            {user.username}
                        </Link>
                    }
                />
            </List.Item>
    )
}