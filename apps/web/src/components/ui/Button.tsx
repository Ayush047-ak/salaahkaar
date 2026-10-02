import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}) => (
  <button
    className={`btn-${variant}${className ? ` ${className}` : ''}`}
    type={type}
    {...props}
  >
    {children}
  </button>
);

export default Button;
