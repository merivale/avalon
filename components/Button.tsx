import type { VNode } from "preact";

type Props = {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: VNode | string;
  color?: "blue" | "red" | "green" | "gray";
  class?: string;
};

export default ({
  type = "submit",
  disabled = false,
  children,
  color = "blue",
  class: className,
}: Props): VNode => {
  const variantClasses = color === "gray" || disabled
    ? "bg-gray hover:bg-gray-dark"
    : color === "blue"
    ? "bg-blue hover:bg-blue-dark"
    : color === "red"
    ? "bg-red hover:bg-red-dark"
    : "bg-green hover:bg-green-dark";

  return (
    <button
      type={type}
      disabled={disabled}
      class={`${variantClasses} ${
        className ?? ""
      } text-white py-1 px-2 cursor-pointer disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};
