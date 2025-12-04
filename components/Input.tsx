import type { VNode } from "preact";

type InputProps = {
  type?: "text" | "checkbox";
  id?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  value?: string;
  class?: string;
  label?: string;
};

export const Input = ({
  type = "text",
  id,
  name,
  placeholder,
  required = false,
  maxLength,
  value,
  class: className = "",
  label
}: InputProps): VNode => {
  const inputId = id || name;
  
  if (type === "checkbox") {
    const checkbox = (
      <input
        type="checkbox"
        id={inputId}
        name={name}
        value={value}
        class={`w-4 h-4 ${className}`}
      />
    );
    
    if (label) {
      return (
        <label htmlFor={inputId} class="flex items-center gap-2 cursor-pointer">
          {checkbox}
          <span class="text-sm">{label}</span>
        </label>
      );
    }
    
    return checkbox;
  }

  const textInput = (
    <input
      type={type}
      id={inputId}
      name={name}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      class={`input ${className}`}
    />
  );
  
  if (label) {
    return (
      <div class="flex flex-col gap-1">
        <label htmlFor={inputId} class="font-medium text-primary text-sm">{label}</label>
        {textInput}
      </div>
    );
  }
  
  return textInput;
};
