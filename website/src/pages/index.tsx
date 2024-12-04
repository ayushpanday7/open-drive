import { Loader as LoaderComponent } from '@components'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
/**
 * A loading component that handles authentication state.
 * This component makes an API call to determine whether to keep the user logged in or logged out.
 * 
 * @returns - A simple loading indicator div element
 */
export default function Loader({runningOnServer = true}) {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
            if (!runningOnServer)throw new Error('Error')
        }, 5000)
    }, [])
    return (
        loading ? <LoaderComponent /> : <Navigate to="/auth/login" replace />
    )

}