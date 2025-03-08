'use client';
import { useEffect, useRef } from 'react';

export const AutoResizeInput: React.FC<{
  defaultValue: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}> = ({ defaultValue, onChange, placeholder, className }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [defaultValue]);

  return (
    <textarea
      ref={inputRef}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full resize-none overflow-hidden border-none bg-transparent pt-0 text-2xl font-bold leading-tight outline-none focus:ring-0 ${className}`}
      rows={1}
    />
  );
};
