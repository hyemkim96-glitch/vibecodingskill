'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function savePRD(content: string, metadata: any) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Authentication required' }

    const { data, error } = await supabase
        .from('prds')
        .insert({
            user_id: user.id,
            content,
            metadata: metadata || {}
        })
        .select()
        .single()

    if (error) {
        console.error('Error saving PRD:', error)
        return { error: 'Failed to save PRD to history.' }
    }

    revalidatePath('/profile')
    return { success: true, id: data.id }
}
