import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";

export async function createSupabaseClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                }, 
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                        )
                    } catch {
                        console.log('Error setting cookies')
                    }
                }
            }
        }
    )
}

export async function getCurrentUser(supabaseClient: SupabaseClient) {
  const {data: {user}, error: userError} = await supabaseClient.auth.getUser();
    if (userError || !user) {
        revalidatePath('/login')
        throw new Error('Authentication required')
    }
    return user;
}