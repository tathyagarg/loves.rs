import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateSubdomain(name: string, lengthCheck = true) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    return "Invalid subdomain name. Only lowercase letters, numbers, and hyphens are allowed.";
  }

  if (name.length === 0) {
    return "Subdomain name cannot be empty.";
  }

  if (lengthCheck) {
    if (name.length < 3 || name.length > 63) {
      return "Subdomain name must be between 3 and 63 characters.";
    }
  }

  if (name.startsWith("-") || name.endsWith("-")) {
    return "Subdomain name cannot start or end with a hyphen.";
  }

  return null;
}

export function rigorouslyValidateSubdomain(name: string, lengthCheck = true) {
  for (const part of name.split(".")) {
    const error = validateSubdomain(part, lengthCheck);
    if (error) {
      return error;
    }
  }
}
