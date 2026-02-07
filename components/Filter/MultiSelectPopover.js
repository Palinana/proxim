"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function MultiSelectPopover({ label, options, value = [], onChange }) {
    const triggerRef = useRef(null);
    const [width, setWidth] = useState(0);

    const toggle = (val) => {
      const newValues = value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val];
    
      // Sort by options order
      const sorted = options
        .map((o) => o.value)
        .filter((v) => newValues.includes(v));
    
      onChange(sorted);
    };
    
    // Capture width of trigger button
    useLayoutEffect(() => {
      if (!triggerRef.current) return;
      setWidth(triggerRef.current.offsetWidth);
    }, []);

    return (
        <Popover>
            <PopoverTrigger PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    className="w-full sm:w-[130px] bg-white font-normal text-secondary-2 justify-between border border-gray-300"
                >
                  <span className="truncate max-w-[90%]">
                      {value.length
                          ? value
                                .map((id) => options.find((o) => o.value === id)?.label || id)
                                .join(", ")
                          : label}
                  </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              style={{ width: width }}
              className="bg-white border border-gray-200 shadow-md p-0 box-border"
            >
                <div className="w-full p-2">
                    {options.map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 rounded w-full"
                        >
                            <Checkbox
                              checked={value.includes(opt.value)}
                              onCheckedChange={() => toggle(opt.value)}
                            />
                            <span className="truncate">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
