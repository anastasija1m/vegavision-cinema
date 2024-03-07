import styled from 'styled-components';
import { Button } from '../shared/Button';

interface MovieMenuProps {
  openAddModal: () => void;
}

const MovieMenuStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 50px;
  margin-top: 50px;
`;

export default function MovieMenu({ openAddModal }: MovieMenuProps) {
  return (
    <MovieMenuStyled>
      <Button
        onClick={openAddModal}
        text="Add New Movie"
      />
    </MovieMenuStyled>
  );
}