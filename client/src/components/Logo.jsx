import React from 'react';

export default function Logo({ size = 48, color = '#1E6C45', className = '' }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer protective shield / soft geometry */}
      <path 
        d="M50 5 C25 5 10 20 10 45 C10 75 35 90 50 95 C65 90 90 75 90 45 C90 20 75 5 50 5 Z" 
        fill={color} 
        fillOpacity="0.08" 
      />
      
      {/* Stem of the P */}
      <path 
        d="M38 30 V70" 
        stroke={color} 
        strokeWidth="8" 
        strokeLinecap="round" 
      />
      
      {/* Loop of the P */}
      <path 
        d="M38 34 H52 C62 34 68 40 68 50 C68 60 62 66 52 66 H38" 
        stroke={color} 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Abstract ear/leaf accent representing agriculture/livestock */}
      <path 
        d="M66 50 C76 40 70 25 55 34" 
        stroke={color} 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Inner eye / health dot */}
      <circle cx="50" cy="50" r="4" fill={color} />
    </svg>
  );
}
