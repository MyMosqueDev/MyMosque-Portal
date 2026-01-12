"use server"

import { createSupabaseClient } from "@/lib/supabase"
import { sanitizeInput } from "@/lib/utils"

interface BetaSignupData {
  name: string
  email: string
}

interface ActionResult {
  data: any | null
  error: string | null
}

function validateBetaSignup(data: BetaSignupData): string[] {
  const errors: string[] = []

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.push("Name is required")
  } else if (data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters")
  } else if (data.name.trim().length > 100) {
    errors.push("Name must be less than 100 characters")
  }

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    errors.push("Email is required")
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email.trim())) {
      errors.push("Please enter a valid email address")
    }
    if (data.email.trim().length > 255) {
      errors.push("Email must be less than 255 characters")
    }
  }

  return errors
}

export async function submitBetaSignup(data: BetaSignupData): Promise<ActionResult> {
  try {
    // Validate input
    const validationErrors = validateBetaSignup(data)
    if (validationErrors.length > 0) {
      return {
        data: null,
        error: validationErrors.join(", "),
      }
    }

    const supabase = await createSupabaseClient()

    // Sanitize input
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: data.email.trim().toLowerCase(), // Normalize email
    }

    // Check if email already exists
    const { data: existingSignup, error: checkError } = await supabase
      .from("android_beta_signups")
      .select("email")
      .eq("email", sanitizedData.email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" which is what we want
      console.error("Error checking existing signup:", checkError)
      return {
        data: null,
        error: "Failed to check existing signup. Please try again.",
      }
    }

    if (existingSignup) {
      return {
        data: null,
        error: "This email is already registered for the beta.",
      }
    }

    // Insert into database
    const { data: newSignup, error: insertError } = await supabase
      .from("android_beta_signups")
      .insert(sanitizedData)
      .select()
      .single()

    if (insertError) {
      console.error("Error inserting beta signup:", insertError)
      return {
        data: null,
        error: "Failed to submit signup. Please try again.",
      }
    }

    return {
      data: newSignup,
      error: null,
    }
  } catch (error) {
    console.error("Unexpected error in submitBetaSignup:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

