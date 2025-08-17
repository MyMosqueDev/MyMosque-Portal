import { clsx, type ClassValue } from "clsx"
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge"
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { SupabaseClient } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim()
}