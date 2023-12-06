import { Carousel, Modal } from 'antd'
import Link from 'antd/es/typography/Link'
const contentStyle: React.CSSProperties = {
  height: '50px',
  color: '#fff',
  lineHeight: '40px',
  textAlign: 'center',
  background: '#ccc',
}
export default function TermCondition({ isOpen, onCloseModal }:any) {
  const onFinish = async () => {
    onCloseModal()
  }

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        onCloseModal()
      }}
      title="Terms and Conditions"
      onOk={onFinish}
      destroyOnClose
    >
      <Carousel autoplay>
        <div>
          <h3 style={contentStyle}>1.Acceptance of Terms:</h3>
          <p>
          By uploading content to Social Ingredient, 
          you agree to comply with and be bound by the 
          following terms and conditions. If you do not agree to these 
          terms, please do not upload any content.
          </p>
        </div>
        <div>
          <h3 style={contentStyle}>2.Content Ownership:</h3>
          <p>
          You retain ownership of the content you upload to Social Ingredient.
          However, by uploading content, you grant Social Ingredient a worldwide,
          non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, 
          translate, create derivative works from, distribute, perform, and display the content.
          </p>
        </div>
        <div>
          <h3 style={contentStyle}>3.Content Guidelines:</h3>
          <p>
          You agree not to upload content that violates any applicable laws,
          infringes on the rights of others, or is otherwise inappropriate. 
          Social Ingredient reserves the right to remove any content that violates these guidelines.
          </p>
        </div>
        <div>
          <h3 style={contentStyle}>3.Community Standards:</h3>
          <p>
          Social Ingredient has community standards in place to ensure a positive and safe environment.
          By uploading content, you agree to abide by these community standards, which are outlined in 
          <Link href='https://transparency.fb.com/vi-vn/policies/community-standards/?source=https%3A%2F%2Fwww.facebook.com%2Fcommunitystandards%2F'>Policy example</Link>.
          </p>
        </div>
      </Carousel>
    </Modal>
  )
}
