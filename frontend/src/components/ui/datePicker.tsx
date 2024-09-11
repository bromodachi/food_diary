import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";
import { cn } from "@/lib/utils.ts";
import { SelectSingleEventHandler } from "react-day-picker";

export class DatePickerState {
  date: Date | undefined = new Date();
}

export interface DatePickerStateProps {
  state: DatePickerState;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

export function DatePicker({ state, setDate }: DatePickerStateProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const handleOnSelect: SelectSingleEventHandler = (date) => {
    setDate?.(date);
    setIsPopoverOpen(false);
  };
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !state.date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {state.date ? format(state.date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          defaultMonth={state.date}
          selected={state.date}
          onSelect={handleOnSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
