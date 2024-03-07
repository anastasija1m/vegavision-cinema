import React, { useState } from 'react';
import styled from 'styled-components';
import { Genre } from '../../models/Genre';
import { Button } from '../shared/Button';

interface HomeFilterMenuProps {
  selectedDate: string | null;
  handleDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  todayFormatted: string;
  nextWeekFormatted: string;
  genres: Genre[];
  handleMovieSortChange: (order: "asc" | "desc") => void;
  handleScreeningSortChange: (order: "asc" | "desc") => void;
  selectedGenres: any;
  handleGenreSelection: any;
}

interface GenreDropdownContentProps {
  open: boolean;
}

const HomeFilterMenuStyled = styled.div`
  background-color: #436850;
  height: 70px;
  display: flex;
  align-items: center;
`;

const DateInputStyled = styled.input`
  font-size: 15px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  margin-left: 20px;
  color: #12372A;
`;

const GenreDropdownWrapper = styled.div`
  margin-left: 20px;
  position: relative;
`;

const GenreDropdownButton = styled.button`
  padding: 10px;
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
`;

const GenreDropdownContent = styled.div<GenreDropdownContentProps>`
  display: ${props => (props.open ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  z-index: 1;
  width: 200px;
`;

const GenreCheckboxLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

export default function HomeFilterMenu({
  selectedDate,
  handleDateChange,
  todayFormatted,
  nextWeekFormatted,
  genres,
  handleMovieSortChange,
  handleScreeningSortChange,
  selectedGenres,
  handleGenreSelection
}: HomeFilterMenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMovieSortAscending = () => {
    handleMovieSortChange("asc");
  };

  const handleMovieSortDescending = () => {
    handleMovieSortChange("desc");
  };

  const handleScreeningSortAscending = () => {
    handleScreeningSortChange("asc");
  };

  const handleScreeningSortDescending = () => {
    handleScreeningSortChange("desc");
  };

  return (
    <HomeFilterMenuStyled>
      <DateInputStyled
        type="date"
        value={selectedDate || ''}
        onChange={handleDateChange}
        min={todayFormatted}
        max={nextWeekFormatted}
      />
      <GenreDropdownWrapper>
        <GenreDropdownButton onClick={toggleDropdown}>
          Select Genres
        </GenreDropdownButton>
        <GenreDropdownContent open={dropdownOpen}>
        {genres.map(genre => (
          <GenreCheckboxLabel key={genre.id}>
            <input 
              type="checkbox" 
              value={genre.id} 
              checked={selectedGenres.includes(genre.id)}
              onChange={() => handleGenreSelection(genre.id)}
            />
            {genre.name}
          </GenreCheckboxLabel>
        ))}
      </GenreDropdownContent>
      </GenreDropdownWrapper>
      <GenreDropdownWrapper>
        <Button onClick={handleMovieSortAscending} text="A-Z ↓ " />
        <Button onClick={handleMovieSortDescending} text="Z-A ↑" />
      </GenreDropdownWrapper>
      <Button onClick={handleScreeningSortAscending} text="Earliest First" />
      <Button onClick={handleScreeningSortDescending} text="Latest First" />
    </HomeFilterMenuStyled>
  );
}