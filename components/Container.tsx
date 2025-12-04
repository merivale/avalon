import type { ComponentChildren, VNode } from "preact";

type ContainerProps = {
  children: ComponentChildren;
};

export const Container = ({ children }: ContainerProps): VNode => {
  return <div class="container">{children}</div>;
};
