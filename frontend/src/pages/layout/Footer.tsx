import { Layout, Space } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import Title from 'antd/es/typography/Title';
import { Link } from 'react-router-dom';

function AppFooter() {
  return (
    <Layout.Footer
      style={{
        backgroundColor: '#040D12',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Space style={{ display: 'block' }}>
        <Title level={5} style={{ color: 'rgba(255, 255, 255, 0)' }}>
          Copyright and created by:
        </Title>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0)' }}>Pham Quang Huy</Paragraph>
      </Space>
      <Space style={{ display: 'block' }}>
        <Title level={5} style={{ color: 'rgba(255, 255, 255, 0)' }}>
          Contact me:
        </Title>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0)' }}>
          Email: quanghuyhd2k2@gmail.com
        </Paragraph>
        <Paragraph style={{ color: 'white' }}>Phone: 0827433602</Paragraph>
      </Space>
      <Space style={{ display: 'block' }}>
        <Title level={5} style={{ color: 'rgba(255, 255, 255, 0)' }}>
          Github source code:
        </Title>
        <Paragraph style={{ color: 'white' }}>
          <Link to='https://github.com/GLCoder2002/final_project.git'>Open with github</Link>
        </Paragraph>
      </Space>
    </Layout.Footer>
  );
}

export default AppFooter;
