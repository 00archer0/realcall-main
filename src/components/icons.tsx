import type { SVGProps } from "react";

export function CallCastLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M12 18h.01" />
      <path d="M4 20.3A15.3 15.3 0 0 1 12 8a15.3 15.3 0 0 1 8 12.3" />
      <path d="M8 12a4 4 0 0 1 8 0" />
    </svg>
  );
}
