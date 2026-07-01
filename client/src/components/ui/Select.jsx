import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  name,
  options = [], // [{ value, label }]
  value,
  onChange,
  error,
  isDisabled = false,
  isRequired = false,
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  const id = useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
            w-full bg-white border text-slate-900 rounded-lg pl-4 pr-10 py-3 text-sm transition-all duration-200 outline-none appearance-none cursor-pointer
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10' 
              : 'border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10'
            }
            ${isDisabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200/60' : 'hover:border-slate-300'}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4 stroke-[2]" />
        </div>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs mt-1 text-red-500 font-medium animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
