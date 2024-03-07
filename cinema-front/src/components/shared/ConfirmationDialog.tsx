import styled from 'styled-components';
import { Button } from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: (id?: number) => void;
  onCancel: () => void;
}

const OverlayStyled = styled.div`
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

const DialogStyled = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ButtonsStyled = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: center;
`;

export default function ConfirmationDialog({ isOpen, message, onConfirm, onCancel }: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <OverlayStyled>
      <DialogStyled>
        <p>{message}</p>
        <ButtonsStyled>
          <Button onClick={onConfirm} text="Confirm" />
          <Button onClick={onCancel} text="Cancel" />
        </ButtonsStyled>
      </DialogStyled>
    </OverlayStyled>
  );
};