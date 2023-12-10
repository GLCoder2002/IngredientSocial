import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { CSSProperties, FC } from "react";

interface SearchFieldProps {
  inputKey?: string;
  setInput?: any;
  placeholder?: string;
  style?: CSSProperties;
}

const SearchField: FC<SearchFieldProps> = ({ inputKey, setInput, placeholder, style }) => {
  return (
    <Input
      size="large"
      style={{
        width: '480px',
        borderRadius: '25px',
        ...style,
      }}
      onPressEnter={() => {}}
      placeholder={placeholder}
      allowClear={true}
      value={inputKey}
      onChange={(e) => setInput(e.target.value)}
      prefix={<SearchOutlined />}
    />
  );
};

export default SearchField;
