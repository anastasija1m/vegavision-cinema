import styled from 'styled-components';
import { Button } from '../shared/Button';

interface GenreFilterMenuProps {
  openAddModal: () => void;
}

const GenreFilterMenuStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 60px;
  margin-right: 20px;
`;

export default function GenreFilterMenu({ openAddModal }: GenreFilterMenuProps) {
  return (
    <GenreFilterMenuStyled>
      <Button
        onClick={openAddModal}
        text="Add Genre"
      />
    </GenreFilterMenuStyled>
  );
}