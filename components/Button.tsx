import type { VNode } from "preact";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  type?: "submit" | "button" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  children: VNode | string;
  class?: string;
};

export const Button = ({ 
  type = "button", 
  variant = "primary", 
  disabled = false, 
  children,
  class: className = ""
}: ButtonProps): VNode => {
  const variantClasses = variant === "primary"
    ? "bg-primary bg-primary-hover"
    : "bg-secondary bg-secondary-hover";
  
  return (
    <button 
      type={type} 
      disabled={disabled}
      class={`btn ${variantClasses} text-white shadow ${className}`}
    >
      {children}
    </button>
  );
};
