import { Input } from "@components"
import { useEffect } from "react"

export default function Login() {
    useEffect(() => {
        import('./auth.css')
    }, [])
    return (
        <div className="form-component-container">
            <form className="form-component">
                <div>Login</div>
                <Input label="Email, Phone or Username" required/>
            </form>
        </div>
    )
}