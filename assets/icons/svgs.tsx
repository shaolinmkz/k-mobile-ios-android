import React from 'react';
import { SvgXml } from 'react-native-svg';


export const LinkSvg = (props: React.ComponentProps<any>) => {
  const svgString = `<svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.146 21.3421C12.422 22.8697 11.1229 24.0486 9.53251 24.6215C7.9421 25.1943 6.18962 25.1144 4.65789 24.3993V24.3993C3.13034 23.6754 1.95138 22.3763 1.37855 20.7859C0.805715 19.1955 0.885571 17.443 1.60067 15.9113L3.54056 11.7886C4.26425 10.2612 5.56307 9.08225 7.15325 8.50941C8.74344 7.93656 10.4957 8.01638 12.0272 8.73142V8.73142C12.9219 9.15349 13.7061 9.77791 14.3178 10.5553C14.9296 11.3327 15.352 12.2417 15.5519 13.2106" stroke="#D01C5D" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.0106 4.65789C12.7345 3.13034 14.0336 1.95138 15.624 1.37855C17.2144 0.805715 18.9669 0.885571 20.4986 1.60067C22.0258 2.32464 23.2045 3.62348 23.7773 5.21356C24.3501 6.80364 24.2705 8.55577 23.5558 10.0873L21.616 14.21C20.892 15.7375 19.5929 16.9165 18.0025 17.4893C16.4121 18.0621 14.6596 17.9823 13.1279 17.2672V17.2672C12.3603 16.9055 11.6727 16.394 11.1057 15.7626C10.5388 15.1313 10.1038 14.3929 9.82642 13.5909" stroke="#D01C5D" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  return <SvgXml xml={svgString} {...props} />
}

export const TransactionSvg = (props: React.ComponentProps<any>) => {
  const svgString = `<svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0)">
  <path d="M5.62001 12.07C3.17001 14.02 1.38001 16.69 0.520007 19.71C0.440008 19.97 0.590008 20.25 0.860008 20.33C0.870008 20.33 0.880007 20.34 0.890007 20.34C2.95001 20.83 10.89 22.18 14.89 15.29C15.3 14.59 15.64 13.84 15.89 13.07" stroke="#D01C5D" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M13.73 19.75C18.3 21.8 23.39 20.21 23.39 20.21C23.39 20.21 21.09 10.13 11.88 10.11C11.07 10.11 10.25 10.19 9.46 10.36" stroke="#D01C5D" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.32 8.89C15.86 5.79 14.44 2.91 12.25 0.659999C12.06 0.459999 11.74 0.449999 11.54 0.639999C11.53 0.649999 11.53 0.649999 11.52 0.659999C10.07 2.2 4.92 8.4 8.9 15.31C9.3 16.02 9.78 16.68 10.33 17.28" stroke="#D01C5D" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
  <clipPath id="clip0">
  <rect width="23.89" height="21.29" fill="white"/>
  </clipPath>
  </defs>
  </svg>`;

  return <SvgXml xml={svgString} {...props} />
}

export const TransferSvg = (props: React.ComponentProps<any>) => {
  const svgString = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M23.5 0.5L9 15" stroke="#D01C5D" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M13.5 23.5L9 15L0.5 10.5L23.5 0.5L13.5 23.5Z" stroke="#D01C5D" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  return <SvgXml xml={svgString} {...props} />
}

