/**
 * @module Loader
 * @description A module containing the initial loading screen component for the Open Drive application.
 * This loader displays a 2x2 grid of images along with a progress bar and loading message.
 * The component is typically shown during application initialization or heavy loading operations.
 * 
 * @requires react
 * @requires ./loader.css - Dynamically imported styles for the loader component
 * @requires @assets/loaderImages/* - Image assets used in the loader display
 */
import loaderImage1 from '@assets/loaderImages/loader-1.jpg'
import loaderImage2 from '@assets/loaderImages/loader-2.jpg'
import loaderImage3 from '@assets/loaderImages/loader-3.jpg'
import loaderImage4 from '@assets/loaderImages/loader-4.jpg'
import { useEffect } from 'react'

/**
 * A loading component that displays a grid of four images.
 * The component dynamically imports its CSS styles on mount.
 * 
 * @component
 * @example
 * ```tsx
 * <Loader />
 * ```
 * 
 * @returns JSX.Element - A div containing a 2x2 grid of loader images
 */
export function Loader() {
    // const router = useNavigate()
    useEffect(() => {
        import('./loader.css')
    }, [])

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        // router('/auth/login')
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    return <div className='initial-loader-component'>
        <div className='loader-image-group-container'>
            <div className='loader-image-group'>
                <img src={loaderImage1} className='initial-loader-image' alt="loader 1" />
                <img src={loaderImage2} className='initial-loader-image' alt="loader 2" />
            </div>
            <div className='loader-image-group'>
                <img src={loaderImage3} className='initial-loader-image' alt="loader 3" />
                <img src={loaderImage4} className='initial-loader-image' alt="loader 4" />
            </div>
        </div>
        <div className='loader-progress-container'>
            <div>Please wait</div>
            <div className='loader-progress-bar' />
        </div>
    </div>
}