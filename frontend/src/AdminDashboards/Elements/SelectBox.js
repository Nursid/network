import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export default function SelectBox({ options, setSelcted, initialValue }) {
  const [selectedOption, setSelectedOption] = useState(null);

 
  useEffect(() => {
    if (options.length > 0 && initialValue) {
      let initialOption = null;
  
      if (typeof initialValue === 'object' && initialValue.value) {
        initialOption = options.find(option => option.value === initialValue.value);
      } else {
        initialOption = options.find(option => option.value === initialValue);
      }
  
      if (initialOption && initialOption.value !== selectedOption?.value) {
        setSelectedOption(initialOption);
        setSelcted(initialOption); // ✅ sirf tab jab naya value ho
      }
    } else if (!initialValue && selectedOption !== null) {
      setSelectedOption(null);
      setSelcted(null);
    }
  }, [initialValue, options]);
  
  

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
