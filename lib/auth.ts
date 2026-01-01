import { NextRequest, NextResponse } from 'next/server'
import { SupabaseClient } from '@supabase/supabase-js'

interface AuthorizationResult {
    authorized: boolean
    errorResponse?: NextResponse
    user?: { id: string }
}

/**
 * Authorizes a request either via secret token or user authentication.
 * 
 * @param request - The Next.js request object
 * @param supabase - The Supabase client instance
 * @param mosqueId - The mosque ID (user's uid) to verify ownership
 * @param secretTokenEnvVar - Optional environment variable name for secret token (defaults to 'CRON_SECRET_TOKEN')
 * @returns Authorization result with authorized status, optional error response, and user if authenticated
 */
export async function authorizeRequest(
    request: NextRequest,
    supabase: SupabaseClient,
    mosqueId: string | null,
    secretTokenEnvVar: string = 'CRON_SECRET_TOKEN'
): Promise<AuthorizationResult> {
    const authHeader = request.headers.get('authorization')
    const secretToken = process.env[secretTokenEnvVar]
    
    // Check for secret token authorization (for external cron services)
    // Handle both "Bearer <token>" and plain token formats
    if (secretToken && authHeader) {
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : authHeader
        if (token === secretToken) {
            return { authorized: true }
        }
    }
    
    // Otherwise, require user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
        return {
            authorized: false,
            errorResponse: new NextResponse('Unauthorized: Authentication required', { status: 401 })
        }
    }
    
    // Verify user owns the mosque (mosqueId is the user's uid)
    if (!mosqueId || user.id !== mosqueId) {
        return {
            authorized: false,
            errorResponse: new NextResponse('Forbidden: You do not have permission to access this mosque', { status: 403 })
        }
    }
    
    return {
        authorized: true,
        user: { id: user.id }
    }
}

