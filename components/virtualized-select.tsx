import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
  MouseEvent,
} from 'react';
import { FixedSizeList as List } from 'react-window';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { debounce } from '@/utils/debounce';

interface Option {
  value: string;
  label: string;
}

interface VirtualizedSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  enableSearch?: boolean;
  isDisabled?: boolean;
}

export function VirtualizedSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  enableSearch = true,
  isDisabled = false,
}: VirtualizedSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
      }, 300),
    [],
  );

  useEffect(() => {
    if (isOpen && enableSearch && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen, enableSearch]);

  const filteredOptions = useMemo(() => {
    if (!enableSearch) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery, enableSearch]);

  const optionsHash = useMemo(() => {
    return options.reduce(
      (acc, option) => {
        acc[option.value] = option.label;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [options]);

  const renderRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const option = filteredOptions[index];
      return (
        <SelectItem
          key={option.value}
          value={option.value}
          style={{ ...style, overflow: 'hidden' }}
        >
          <span className="block truncate">{option.label}</span>
        </SelectItem>
      );
    },
    [filteredOptions],
  );

  const selectValue = value ? optionsHash[value] : placeholder;

  const handleContentClick = useCallback((e: MouseEvent) => {
    // Prevent closing when clicking inside the search input
    if (inputRef.current?.contains(e.target as Node)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={isDisabled}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>{selectValue}</SelectValue>
      </SelectTrigger>
      <SelectContent onClick={handleContentClick}>
        {enableSearch && (
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              debouncedSetSearchQuery(e.target.value);
            }}
            className="mb-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        )}
        <List
          height={150}
          itemCount={filteredOptions.length}
          itemSize={35}
          width={'full'}
        >
          {renderRow}
        </List>
      </SelectContent>
    </Select>
  );
}
