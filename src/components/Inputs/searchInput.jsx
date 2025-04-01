import React, { useEffect, useState } from "react";

// Icones

export function SearchInput({ onSearch, placeholder, term }) {

  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  useEffect(() => {
    setSearchTerm(term);
  }, [term]);

  return (
    <div className="w-full flex justify-center items-center opacity-85">
      <div className="w-full overflow-hidden">
        <input
          className="w-full text-gray-700 rounded-r-full focus:outline-none"
          placeholder={placeholder}
          onChange={handleInputChange}
          value={searchTerm}
        />
      </div>
    </div>
  );
}
