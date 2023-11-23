import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';

interface IRichTextEditor {
  editorState: any;
  setEditorState: (val: any) => void;
  placeholder?: string;
  style?: Object;
}

const RichTextEditor: React.FC<IRichTextEditor> = (props) => {
  const { editorState, setEditorState, placeholder, style } = props;

  const onChange = (value: any) => {
    setEditorState(value);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
  ];

  return (
    <TextEditorWrapper style={style}>
      <ReactQuill
        value={editorState}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Description'}
      />
    </TextEditorWrapper>
  );
};

export default RichTextEditor;

const TextEditorWrapper = styled.div`
  & .ql-editor {
    border: 1px #ccc solid;
    background: white;
    padding: 0 10px;
    word-break: break-word;
    font-weight: 400;
    resize: vertical;
    min-height: 150px;
    width: 100%;
    border-radius: 5px;
    overflow: auto;
  }

  & .ql-toolbar {
    background: #dbdbdb8b;
    border: 0.5px solid #ccc;
    border-radius: 5px;

    & .ql-picker-options {
      color: #000000;
    }
  }
`;
