import React from 'react';

export default function Input({
  labelText,
  labelFor,
  id,
  name,
  type = 'text',
  isRequired = false,
  placeholder = '',
  value,
  handleChange,
  options = [],
  autoComplete = 'off',
  minLength,
  maxLength,
  errorMessage = '',
}) {

  if (type === 'select') {
    return (
      <div className="mb-4">
        <label htmlFor={labelFor} className="block mb-1 font-semibold">
          {labelText}
        </label>
        <select
          id={id}
          name={name}
          required={isRequired}
          value={value}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            errorMessage ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select {labelText}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
        {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
      </div>
    );
  }

  // Render textarea if needed
  if (type === 'textarea') {
    return (
      <div className="mb-4">
        <label htmlFor={labelFor} className="block mb-1 font-semibold">
          {labelText}
        </label>
        <textarea
          id={id}
          name={name}
          required={isRequired}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          className={`w-full px-3 py-2 border rounded-md resize-y ${
            errorMessage ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
      </div>
    );
  }

  // Render regular input (text, email, password, etc.)
  return (
    <div className="mb-4">
      <label htmlFor={labelFor} className="block mb-1 font-semibold">
        {labelText}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={isRequired}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border rounded-md ${
          errorMessage ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
    </div>
  );
}
