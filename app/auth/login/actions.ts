'use server'

import { createClient } from '@/utils/supabase/server'
import { User } from '@/lib/types'

interface LoginFormData {
  email: string
  password: string
}

export async function login(formData: LoginFormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password
  }

  const result = await supabase.auth.signInWithPassword(data)

  if (result.error) {
    return { error: result.error.message }
  }

    if (result.data.user.id && result.data.user.email) {
        const user: User = {
            id: result.data.user.id,
            email: result.data.user.email,
        }
    return { success: true, user: user }
  }

  return { error: "User not found" }
}

// SIGN UP CURRENTLY NOT USED, BUT CAN BE USED LATER
// export async function signup(formData: FormData) {
//   const supabase = await createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { error } = await supabase.auth.signUp(data)

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }