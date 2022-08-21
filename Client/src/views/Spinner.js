import { useState, useEffect } from 'react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

function Spinner() {
  const color = '#000000';
  useEffect(() => {});
  return (
    <div className="sweet-loading">
      <ClimbingBoxLoader color={color} loading={true} size={20} />
      <span className="sweet-loading-txt">Loading...</span>
    </div>
  );
}

export default Spinner;
