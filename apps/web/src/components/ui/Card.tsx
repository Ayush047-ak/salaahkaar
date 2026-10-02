import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  interactive = false,
  ...props
}) => (
  <div
    className={`card-panel${interactive ? ' card-panel--interactive' : ''}${className ? ` ${className}` : ''}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
