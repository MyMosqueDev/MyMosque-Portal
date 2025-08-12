import { User } from "@/lib/types"
import { useEffect } from "react"

export default function useUser({setUser}: {setUser: (user: User) => void} ) {
    useEffect(() => {
        const userStr = localStorage.getItem('authenticatedUser')
            if (userStr) {
                try {
                    const user = JSON.parse(userStr)
                    setUser(user)
                    } catch (error) {
                    console.error('Error parsing user data:', error)
                }
            }
    }, [])
}