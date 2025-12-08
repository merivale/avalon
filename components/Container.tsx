import type { ComponentChildren, VNode } from "preact";

type Props = {
  children: ComponentChildren;
  class?: string;
};

export default ({ children, class: className }: Props): VNode => {
  return (
    <div class={`mx-auto w-max grid grid-cols-2 gap-4 p-4 ${className ?? ""}`}>
      {children}
    </div>
  );
};
