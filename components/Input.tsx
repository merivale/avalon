import type { VNode } from "preact";

type Props = {
  type?: "text" | "checkbox";
  id?: string;
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  checked?: boolean;
  required?: boolean;
  maxLength?: number;
};

export default ({
  type = "text",
  id,
  label,
  name,
  placeholder,
  value,
  checked,
  required = false,
  maxLength,
}: Props): VNode => {
  const inputId = id ?? name;

  return type === "checkbox"
    ? (
      <label
        htmlFor={inputId}
        class="py-1 px-2 flex gap-2 items-center cursor-pointer"
      >
        <input
          type="checkbox"
          id={inputId}
          name={name}
          checked={checked}
        />
        <span>{label}</span>
      </label>
    )
    : (
      <div class="flex gap-2 items-center">
        <label htmlFor={inputId}>{label}</label>
        <input
          type={type}
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          required={required}
          maxLength={maxLength}
          class="border py-1 px-2"
        />
      </div>
    );
};
