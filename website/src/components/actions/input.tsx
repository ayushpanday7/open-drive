import { useEffect } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: string;
  label?: string;
  error?: string;
}
export function Input(props: InputProps) {
    useEffect(() => {
        import('./actions.css')
    }, [])
  return (
    <div className="input-component-container">
      <label className="input-component-label" htmlFor="">{props.label} <span className="required-label-marker">{props.required && '*'}</span></label>
      <input className="input-component" {...props} />
      <div>{props.error}</div>
    </div>
  );
}
