import styled, { css } from 'styled-components'
import { ButtonType } from '../../types/ButtonType';

interface ButtonProps {
  onClick?: () => void;
  text: string;
  color?: string;
  type?: ButtonType;
  disabled?: boolean;
}

const disabledStyles = css`
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
`;

export const ButtonStyled = styled.button`
  margin-left: 10px;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  background-color: ${({ color }) => color || '#ADBC9F'};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
  margin-top: 10px;
  width: auto;

  &:hover {
    background-color: #436850;
  }

  ${({ disabled }) => disabled && disabledStyles}
`;

export function Button({ onClick, text, color, type, disabled }: ButtonProps) {
  return (
    <ButtonStyled onClick={onClick} color={color} type={type} disabled={disabled}>
      {text}
    </ButtonStyled>
  );
}