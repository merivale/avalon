import type { ComponentChildren, VNode } from "preact";

type Props = {
  children: ComponentChildren;
  class?: string;
};

export default ({ class: className, children }: Props): VNode => {
  return (
    <div class={`bg-white p-4 shadow ${className ?? ""}`}>
      {children}
    </div>
  );
};
