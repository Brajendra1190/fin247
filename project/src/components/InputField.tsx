import React from 'react';

interface InputFieldProps {
  name: string;
  label: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ name, label, value, onChange, required = true }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {!required && <span className="text-gray-400">(Optional)</span>}
      </label>
      <input
        type="number"
        name={name}
        value={value === 0 ? '' : value}
        onChange={onChange}
        className="input-field"
        placeholder="Enter amount"
        step="0.01"
        required={required}
      />
    </div>
  );
};

export default InputField;