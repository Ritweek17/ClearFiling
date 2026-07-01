import React, { useId } from 'react';

const Textarea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  isDisabled = false,
  isRequired = false,
  rows = 4,
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
      
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        required={isRequired}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          w-full bg-white border text-slate-900 rounded-lg px-4 py-3 text-sm transition-all duration-200 outline-none resize-none
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10' 
            : 'border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10'
          }
          ${isDisabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200/60' : 'hover:border-slate-300'}
        `}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="text-xs mt-1 text-red-500 font-medium animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;
