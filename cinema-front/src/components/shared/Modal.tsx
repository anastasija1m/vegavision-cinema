import styled from 'styled-components';
import { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode
}

const ModalOverlayStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Modal({ children }: ModalProps) {
  return (
    <ModalOverlayStyled>
      {children}
    </ModalOverlayStyled>
  );
};