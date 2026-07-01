import React, { useId } from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  isDisabled = false,
  isRequired = false,
  className = '',
  icon: Icon = null,
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
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-5 h-5 stroke-[1.75]" />
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
            w-full bg-white border text-slate-900 rounded-lg px-4 py-3 text-sm transition-all duration-200 outline-none
            ${Icon ? 'pl-11' : 'pl-4'}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10' 
              : 'border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10'
            }
            ${isDisabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200/60' : 'hover:border-slate-300'}
          `}
          {...props}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs mt-1 text-red-500 font-medium animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
