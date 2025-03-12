import React from "react";

const SlippageSetting = ({ slippage, setSlippage }) => {
  const handleSlippageChange = (e) => {
    setSlippage(e.target.value);
  };

  return (
    <div>
      <label>
        Slippage (%):
        <input
          type="number"
          value={slippage}
          onChange={handleSlippageChange}
          min="0"
          step="0.1"
        />
      </label>
    </div>
  );
};

export default SlippageSetting;
