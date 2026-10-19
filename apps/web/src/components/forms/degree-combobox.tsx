"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { degreeService } from "@/services/degree/degree.service";
import { Check, ChevronDown, Search, X, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

// Sensible fallback initial degrees
const FALLBACK_DEGREES = [
  "Computer Science",
  "Computer Science and Engineering",
  "Information Technology",
  "Artificial Intelligence",
  "Artificial Intelligence and Machine Learning",
  "Data Science",
  "Software Engineering",
  "Cybersecurity",
  "Electronics and Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Bachelor of Engineering",
  "Bachelor of Technology",
  "Master of Engineering",
  "Master of Technology",
  "Bachelor of Science",
  "Master of Science",
  "Bachelor of Computer Applications",
  "Master of Computer Applications",
  "Business Administration",
  "Commerce",
  "Mathematics",
  "Physics",
];

const OTHER_OPTION = "Other / Custom";

interface DegreeComboboxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function DegreeCombobox({ value, onChange, disabled }: DegreeComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [degrees, setDegrees] = useState<string[]>(FALLBACK_DEGREES);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch degree dataset from API
  useEffect(() => {
    let isMounted = true;
    const loadDegrees = async () => {
      try {
        setIsLoading(true);
        const data = await degreeService.getDegrees();
        if (isMounted && data && data.length > 0) {
          setDegrees(data);
        }
      } catch (err) {
        // Fallback to initial local degrees on error/offline
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDegrees();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state if initial value is custom
  useEffect(() => {
    if (value && !degrees.includes(value) && !FALLBACK_DEGREES.includes(value) && value !== OTHER_OPTION) {
      setIsCustomSelected(true);
      setCustomValue(value);
    } else if (value && (degrees.includes(value) || FALLBACK_DEGREES.includes(value))) {
      setIsCustomSelected(false);
    }
  }, [value, degrees]);

  // Filtered degrees based on search term
  const filteredDegrees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return degrees;
    return degrees.filter((deg) => deg.toLowerCase().includes(term));
  }, [degrees, searchTerm]);

  // Complete list including Other / Custom
  const selectableItems = useMemo(() => {
    return [...filteredDegrees, OTHER_OPTION];
  }, [filteredDegrees]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  // Handle selection of degree item
  const handleSelectDegree = (selected: string) => {
    if (selected === OTHER_OPTION) {
      setIsCustomSelected(true);
      setIsOpen(false);
      onChange(customValue.trim() || "");
    } else {
      setIsCustomSelected(false);
      setCustomValue("");
      onChange(selected);
      setIsOpen(false);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange(val);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < selectableItems.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : selectableItems.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < selectableItems.length) {
          handleSelectDegree(selectableItems[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const activeElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const displayLabel = isCustomSelected
    ? OTHER_OPTION
    : value || "Search or select your degree...";

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            !value && !isCustomSelected ? "text-muted-foreground" : "text-foreground font-normal"
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <GraduationCap className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{displayLabel}</span>
          </div>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 opacity-50 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1.5 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95">
            {/* Search Input */}
            <div className="flex items-center border-b border-border/70 px-3 py-2">
              <Search className="mr-2 size-4 shrink-0 opacity-50" />
              <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search degrees..."
                className="flex h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="rounded p-0.5 hover:bg-muted"
                >
                  <X className="size-3.5 opacity-60" />
                </button>
              )}
            </div>

            {/* Scrollable Degree List */}
            <div
              ref={listRef}
              role="listbox"
              className="max-h-60 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-muted-foreground/20"
            >
              {filteredDegrees.length === 0 && (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No degrees found.
                </div>
              )}

              {filteredDegrees.map((degree, index) => {
                const isSelected = value === degree && !isCustomSelected;
                const isHighlighted = highlightedIndex === index;

                return (
                  <div
                    key={degree}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectDegree(degree)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2.5 py-2 text-sm outline-none transition-colors",
                      isHighlighted ? "bg-accent text-accent-foreground" : "text-foreground",
                      isSelected && "font-medium text-primary"
                    )}
                  >
                    <span className="flex-1 truncate">{degree}</span>
                    {isSelected && <Check className="ml-2 size-4 shrink-0 text-primary" />}
                  </div>
                );
              })}

              {/* Other / Custom Option */}
              <div
                role="option"
                aria-selected={isCustomSelected}
                onClick={() => handleSelectDegree(OTHER_OPTION)}
                onMouseEnter={() => setHighlightedIndex(filteredDegrees.length)}
                className={cn(
                  "relative mt-1 flex cursor-pointer select-none items-center rounded-sm border-t border-border/50 px-2.5 py-2 text-sm text-primary transition-colors hover:bg-accent",
                  highlightedIndex === filteredDegrees.length && "bg-accent text-accent-foreground",
                  isCustomSelected && "font-semibold bg-accent/50"
                )}
              >
                <span className="flex-1">+ Other / Custom</span>
                {isCustomSelected && <Check className="ml-2 size-4 shrink-0 text-primary" />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Degree Input Field */}
      {isCustomSelected && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <Label className="text-xs text-muted-foreground">Enter your custom degree program</Label>
          <Input
            value={customValue}
            onChange={handleCustomChange}
            placeholder="e.g. Dual Degree in Robotics & AI"
            maxLength={100}
            disabled={disabled}
            className="border-primary/40 focus-visible:ring-primary"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
