"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const popularRoles = [
  "Frontend Developer", "Backend Developer", "Full Stack Engineer",
  "DevOps Engineer", "Data Scientist", "AI/ML Engineer", "Product Manager"
];

const popularCompanies = [
  "Google", "Amazon", "Microsoft", "Meta", "Netflix", "Uber", "Apple"
];

interface StringSelectorProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}

export function StringSelector({ label, placeholder, value, onChange, suggestions }: StringSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">{label}</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-9 h-10 text-base"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Popular Choices</h4>
        <div className="flex flex-wrap gap-2">
          {suggestions.map(suggestion => (
            <Badge 
              key={suggestion}
              variant={value === suggestion ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80 hover:text-primary-foreground px-3 py-1.5 text-xs transition-colors"
              onClick={() => onChange(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RoleSelector({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
    <StringSelector 
      label="Target Role" 
      placeholder="e.g. Senior React Developer" 
      value={value} 
      onChange={onChange} 
      suggestions={popularRoles} 
    />
  );
}

export function CompanySelector({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
    <StringSelector 
      label="Target Company" 
      placeholder="e.g. Stripe" 
      value={value} 
      onChange={onChange} 
      suggestions={popularCompanies} 
    />
  );
}
