"use client";

import { forwardRef, useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

interface FormPasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  hasError?: boolean;
}

const FormPasswordInput = forwardRef<HTMLInputElement, FormPasswordInputProps>(
  ({ hasError, className = "", ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={[
            "w-full rounded-xl border bg-input px-4 py-3 pr-11 text-sm text-foreground outline-none transition-all duration-200",
            "placeholder:text-muted/60",
            hasError
              ? "border-danger/60 focus:border-danger focus:ring-2 focus:ring-danger/20"
              : "border-divider hover:border-muted/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
            className,
          ].join(" ")}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
          aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}
        >
          {visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      </div>
    );
  },
);

FormPasswordInput.displayName = "FormPasswordInput";
export default FormPasswordInput;
