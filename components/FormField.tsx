import React from 'react'

export interface SelectGroup {
  label: string
  options: readonly { value: string; label: string }[]
}

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea' | 'select'
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  optionGroups?: SelectGroup[]
  rows?: number
  min?: string
  helpText?: string
  disabled?: boolean
  preFilled?: boolean
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'search'
  resize?: 'none' | 'vertical'
  minHeight?: string
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options,
  optionGroups,
  rows = 6,
  min,
  helpText,
  disabled = false,
  preFilled = false,
  inputMode,
  resize = 'none',
  minHeight,
}: FormFieldProps) {
  const isDisabled = disabled || preFilled
  const borderClass = error
    ? 'border-red-500'
    : preFilled
      ? 'border-gray-100'
      : 'border-gray-200'
  const bgClass = preFilled
    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
    : isDisabled
      ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
      : 'bg-white'
  const baseInputClasses = `w-full px-3 py-2.5 border ${borderClass} rounded-md focus:border-umak-blue focus:ring-2 focus:ring-umak-blue/20 focus:outline-none transition-all font-metropolis text-sm ${bgClass}`

  return (
    <div>
      <label className="flex items-center mb-1.5">
        <span className="text-sm text-gray-700 font-metropolis font-semibold">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {preFilled && (
          <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            ✓ Pre-filled
          </span>
        )}
      </label>

      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${baseInputClasses} leading-relaxed ${
            resize === 'vertical' ? 'resize-y' : 'resize-none'
          }`}
          placeholder={placeholder}
          required={required}
          disabled={isDisabled}
          style={minHeight ? { minHeight } : undefined}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
          required={required}
          disabled={isDisabled}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {optionGroups
            ? optionGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
          placeholder={placeholder}
          required={required}
          min={min}
          disabled={isDisabled}
          inputMode={inputMode}
        />
      )}

      {preFilled && !error ? (
        <p className="text-xs text-emerald-600 mt-1 font-metropolis">
          🔒 Auto-filled from your account
        </p>
      ) : helpText && !error ? (
        <p className="text-xs text-gray-500 mt-2 font-metropolis">{helpText}</p>
      ) : null}

      {error && <p className="text-red-500 text-xs mt-1 font-metropolis">{error}</p>}
    </div>
  )
}
