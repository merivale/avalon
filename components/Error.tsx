import type { VNode } from "preact";

type Props = {
  message: string;
};

export default ({ message }: Props): VNode => {
  return (
    <div class="py-1 px-2 bg-red text-white">
      {message}
    </div>
  );
};
