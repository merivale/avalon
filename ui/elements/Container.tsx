import type { ComponentChildren, VNode } from "preact";

type Props = {
  children: ComponentChildren;
  id?: string;
  class?: string;
};

export default ({ children, id, class: className }: Props): VNode => {
  return (
    <div
      id={id}
      class={`mx-auto w-max grid grid-cols-2 gap-4 p-4 ${className ?? ""}`}
    >
      {children}
    </div>
  );
};
