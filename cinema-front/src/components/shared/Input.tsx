import styled from 'styled-components'
import { HTMLInputTypeAttribute } from 'react'

interface InputProps {
  name: string;
  type: HTMLInputTypeAttribute;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputStyled = styled.input`
  padding: 8px;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #FBFADA; 
  }
`;

export default function Input({ name, type, value, onChange, placeholder }: InputProps) {
  return (
    <InputStyled
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}