import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
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
      <path d="M7 20h10" />
      <path d="M12 4v16" />
      <path d="M10.5 3.5l-5 2" />
      <path d="M13.5 3.5l5 2" />
      <path d="m18 16-3-3 3-3" />
      <path d="m6 16 3-3-3-3" />
    </svg>
  );
}
