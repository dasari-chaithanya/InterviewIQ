import {
  LayoutDashboard,
  Mic,
  FileText,
  History,
  BarChart3,
  Code2,
  Settings,
  User,
  LucideIcon
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigationData: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Practice Hub",
    items: [
      {
        title: "AI Interview",
        href: "/interview",
        icon: Mic,
      },
      {
        title: "Resume Analysis",
        href: "/resume",
        icon: FileText,
      },
    ],
  },
  {
    title: "Coding Platform",
    items: [
      {
        title: "Dashboard",
        href: "/coding",
        icon: LayoutDashboard,
      },
      {
        title: "Problems",
        href: "/coding/problems",
        icon: Code2,
      },
      {
        title: "Analytics",
        href: "/coding/analytics",
        icon: BarChart3,
      },
      {
        title: "Reports",
        href: "/coding/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "Performance",
    items: [
      {
        title: "Interview History",
        href: "/history",
        icon: History,
      },
      {
        title: "General Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },
];

export const bottomNavigationData: NavItem[] = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];
