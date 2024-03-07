import styled from "styled-components";

interface SortOptionsProps {
    handleSortChange: (sortOption: string) => void;
  }
  
  const SortOptionsContainer = styled.div`
    margin-left: 20px;
  `;
  
  const SortOptionsLabel = styled.label`
    margin-right: 10px;
  `;
  
  export const SortOptions: React.FC<SortOptionsProps> = ({ handleSortChange }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      handleSortChange(event.target.value);
    };
  
    return (
      <SortOptionsContainer>

      </SortOptionsContainer>
    );
  };