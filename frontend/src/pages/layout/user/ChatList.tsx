import React, { useState } from 'react';
import { List, Avatar, Card, Row, Col } from 'antd';

const userList = [
  // Replace with your actual user data
  { _id: '1', username: 'User 1', avatar: 'avatar1.jpg' },
  { _id: '2', username: 'User 2', avatar: 'avatar2.jpg' },
  // Add more users as needed
];

const UserList = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleUserClick = (user:any) => {
    setSelectedUser(user);
  };

  return (
    <Row gutter={16}>
      <Col span={8}>
        <div
          style={{
            height: '400px', // Adjust the height as needed
            overflowY: 'auto',
          }}
        >
          <List
            dataSource={userList}
            renderItem={(user) => (
              <List.Item onClick={() => handleUserClick(user)}>
                <List.Item.Meta
                  avatar={<Avatar src={user.avatar} />}
                  title={user.username}
                />
              </List.Item>
            )}
          />
        </div>
      </Col>
      <Col span={16}>
        {selectedUser && (
          <Card title={`Chat with ${selectedUser.username}`}>
            {/* Render chat messages here */}
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default UserList;
