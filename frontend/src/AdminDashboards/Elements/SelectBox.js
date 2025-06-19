import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export default function SelectBox({ options, setSelcted, initialValue }) {
  const [selectedOption, setSelectedOption] = useState(null);

 
  useEffect(() => {
    if (options.length > 0 && initialValue) {
      let initialOption = null;
      
      // Check if initialValue is an object with value property or just a string/value
      if (typeof initialValue === 'object' && initialValue.value) {
        // initialValue is an object like {value: "Male", label: "Male"}
        initialOption = options.find(option => option.value === initialValue.value);
      } else {
        // initialValue is a simple value like "Male"
        initialOption = options.find(option => option.value === initialValue);
      }
      
      if (initialOption) {
        setSelectedOption(initialOption);
        setSelcted(initialOption); 
      }
    } else if (!initialValue) {
      // Reset selection when initialValue is null/undefined
      setSelectedOption(null);
    }
  }, [initialValue, options, setSelcted]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setSelcted(selectedOption);
  };

  return (
    <Select
      className='borderColor-yellow'
      value={selectedOption}
      onChange={handleChange}
      options={options}
    />
  );
}


// import React, { useState } from 'react';
// import Select from 'react-select';

// export default function SelectBox({ options,setSelcted }) {
//   const [selectedOption, setSelectedOption] = useState(null);

//   const handleChange = (selectedOption) => {
//     setSelectedOption(selectedOption);
//     setSelcted(selectedOption)
//     console.log('Option selected:', selectedOption);
//   };

//   return (
//     <Select
//       className='borderColor-yellow'
//       value={selectedOption}
//       onChange={handleChange}
//       options={options}
//     />
//   );
// }
