import React, { useState } from 'react';

const ToolTip = ({ children, text, position }) => {
  const [show, setShow] = useState(false);

  const positions = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={`absolute z-10 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow ${positions[position]}`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default ToolTip;
