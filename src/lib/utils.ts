import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = date instanceof Date ? date : new Date(date);
  
  // Get time difference in seconds
  const secondsAgo = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
  // Define time intervals in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (secondsAgo < minute) {
    return "just now";
  } else if (secondsAgo < hour) {
    const minutes = Math.floor(secondsAgo / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (secondsAgo < day) {
    const hours = Math.floor(secondsAgo / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (secondsAgo < week) {
    const days = Math.floor(secondsAgo / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (secondsAgo < month) {
    const weeks = Math.floor(secondsAgo / week);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (secondsAgo < year) {
    const months = Math.floor(secondsAgo / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(secondsAgo / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
}
