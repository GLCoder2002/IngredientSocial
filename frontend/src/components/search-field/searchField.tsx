import {SearchOutlined} from "@ant-design/icons";
import { Input } from "antd";

import {FC} from "react";

interface SearchFieldProps {
  inputKey?: string,
  setInput?: any,
  placeholder?: string
}

const SearchField: FC < SearchFieldProps > = ({inputKey, setInput, placeholder}) => {
  return (<Input size="large" 
    style={
      {width: '480px',
    borderRadius:'25px',
    }
    }
    onPressEnter={
      () => {}
    }
    placeholder={placeholder}
    allowClear={true}
    value={inputKey}
    onChange={
      (e) => setInput(e.target.value)
    }
    prefix={<SearchOutlined/>}/>)
}
export default SearchField;


