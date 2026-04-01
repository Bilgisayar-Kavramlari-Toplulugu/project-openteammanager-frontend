"use client";

import { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ hasError, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          "w-full rounded-xl border bg-input px-4 py-3 text-sm text-foreground outline-none transition-all duration-200",
          "placeholder:text-muted/60",
          hasError
            ? "border-danger/60 focus:border-danger focus:ring-2 focus:ring-danger/20"
            : "border-divider hover:border-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
          className,
        ].join(" ")}
        {...props}
      />
    );
  },
);

FormInput.displayName = "FormInput";
export default FormInput;
