'use client';
import React, { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  defaultValue: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  defaultValue,
  onChange,
  className,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [defaultValue]);

  return (
    <Textarea
      ref={textareaRef}
      defaultValue={defaultValue}
      onChange={onChange}
      className={`min-h-[300px] overflow-hidden ${className}`}
      {...props}
    />
  );
};
