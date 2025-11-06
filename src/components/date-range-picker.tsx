'use client';

import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
//import { DateRange } from 'react-day-picker';
import { DateRange } from '@/types/analytics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (value: DateRange | undefined) => void;
  className?: string;
}

const presetRanges = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'last7' },
  { label: 'Last 30 days', value: 'last30' },
  { label: 'This month', value: 'thisMonth' },
  { label: 'Last month', value: 'lastMonth' },
];

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetChange = (preset: string) => {
    const today = new Date();
    let range: DateRange;

    switch (preset) {
      case 'today':
        range = { from: today, to: today };
        break;
      case 'yesterday':
        const yesterday = subDays(today, 1);
        range = { from: yesterday, to: yesterday };
        break;
      case 'last7':
        range = { from: subDays(today, 7), to: today };
        break;
      case 'last30':
        range = { from: subDays(today, 30), to: today };
        break;
      case 'thisMonth':
        range = { 
          from: startOfMonth(today), 
          to: endOfMonth(today) 
        };
        break;
      case 'lastMonth':
        const firstDayLastMonth = startOfMonth(subDays(today, 30));
        range = { 
          from: firstDayLastMonth, 
          to: endOfMonth(firstDayLastMonth) 
        };
        break;
      default:
        return;
    }

    onChange(range);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y')} -{' '}
                  {format(value.to, 'LLL dd, y')}
                </>
              ) : (
                format(value.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="p-4 border-r">
              <h4 className="text-sm font-medium mb-3">Preset Ranges</h4>
              <div className="space-y-2">
                {presetRanges.map((preset) => (
                  <Button
                    key={preset.value}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      handlePresetChange(preset.value);
                      setIsOpen(false);
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="p-4">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={value?.from}
                selected={value}
                onSelect={onChange}
                numberOfMonths={2}
                className="p-3"
              />
              <div className="flex justify-between p-3 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}