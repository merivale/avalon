import type { VNode, ComponentChildren } from "preact";

type CardProps = {
  children: ComponentChildren;
  class?: string;
};

export const Card = ({ children, class: className = "" }: CardProps): VNode => {
  return (
    <div class={`bg-white rounded-xl p-8 shadow-lg ${className}`}>
      {children}
    </div>
  );
};
