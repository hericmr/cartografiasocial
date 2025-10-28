import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({ label, id, type, value, onChange, placeholder, error, required, helpText, step }) => (
  <div>
    <label className="block font-medium" htmlFor={String(id)}>
      {String(label)} {required && <span className="text-red-500">*</span>}
    </label>
    {error && <p className="text-red-500 text-sm">{String(error)}</p>}
    <input
      id={String(id)}
      type={type ? String(type) : "text"}
      step={step}
      className="w-full border rounded p-2 text-black"
      placeholder={placeholder ? String(placeholder) : undefined}
      value={value ? String(value) : ""}
      onChange={onChange}
      required={Boolean(required)}
    />
    {helpText && <p className="text-gray-500 text-sm mt-1">{String(helpText)}</p>}
  </div>
);

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  helpText: PropTypes.string,
  step: PropTypes.string
};

InputField.defaultProps = {
  type: 'text',
  required: false
};

export default InputField; 