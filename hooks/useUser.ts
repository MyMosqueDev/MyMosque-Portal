import { User } from "@/lib/types"
import { useEffect } from "react"

export default function useUser({setUser}: {setUser: (user: User) => void} ) {
    useEffect(() => {
        const userStr = localStorage.getItem('authenticatedUser')
            if (userStr) {
                try {
                    const user = JSON.parse(userStr)
                    if (user && user.id == "8b8e68c7-4d65-4f39-8baa-b4687eef861e") {
                        user.id = 1
                    }
                    setUser(user)
                    console.log('User ID:', user.id)
                    } catch (error) {
                    console.error('Error parsing user data:', error)
                }
            }
    }, [])
}