import React, { useState } from 'react';
import { Input, List, ListItem } from '@chakra-ui/react';

interface AutocompleteProps {
  suggestions: string[];
  onSelect: (selectedValue: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ suggestions, onSelect }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);

    // Filter suggestions based on input value
    const filtered = suggestions.filter((suggestion) => suggestion.toLowerCase().includes(newInputValue.toLowerCase()));
    setFilteredSuggestions(filtered);
  };

  const handleSuggestionClick = (selectedSuggestion: string) => {
    setInputValue(selectedSuggestion);
    setFilteredSuggestions([]);
    onSelect(selectedSuggestion);
  };

  return (
    <div>
      <Input value={inputValue} onChange={handleInputChange} placeholder="Type to search..." />
      {filteredSuggestions.length > 0 && (
        <List mt={2}>
          {filteredSuggestions.map((suggestion, index) => (
            <ListItem key={index} cursor="pointer" onClick={() => handleSuggestionClick(suggestion)} _hover={{ backgroundColor: 'gray.100' }}>
              {suggestion}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default Autocomplete;
