import { MosqueInfo as MosqueInfoType } from "@/lib/types"
import { supabase } from "@/utils/supabase/client"
import { useEffect } from "react"

export default function useMosqueInfo({setMosqueInfo}: {setMosqueInfo: (mosque: MosqueInfoType) => void} ) {
    useEffect(() => {
        const userStr = localStorage.getItem('authenticatedUser')
            if (userStr) {
                try {
                    const user = JSON.parse(userStr)
                    const getMosqueInfo = async () => {
                        const { data, error } = await supabase.from('mosques').select('*').eq('uid', user.id).single()
                        if (error) {
                            console.error('Error fetching mosque info:', error)
                        } else {
                            setMosqueInfo(data as MosqueInfoType)
                        }
                    }
                    getMosqueInfo()
                } catch (error) {
                    console.error('Error parsing user data:', error)
                }
            }
    }, [])
}