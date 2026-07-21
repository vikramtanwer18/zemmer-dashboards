import React from "react";

interface IconProps {
  name: string;
  className?: string;
  fill?: boolean;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  className = "", 
  fill = false,
  size = 24 
}) => {
  return (
    <span 
      className={`material-symbols-outlined ${className}`}
      style={{ 
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        fontSize: `${size}px`
      }}
    >
      {name}
    </span>
  );
};
