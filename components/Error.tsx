import type { VNode } from "preact";

type ErrorProps = {
  message: string | null;
};

export const Error = ({ message }: ErrorProps): VNode | null => {
  if (!message) return null;
  
  return (
    <div class="p-4 bg-red-100 text-red-900 rounded mb-6 font-medium">
      {message}
    </div>
  );
};
