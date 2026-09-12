import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const SIZE_CLASS = {
    sm: "glow-btn--sm",
    md: "glow-btn--md",
    lg: "glow-btn--lg",
} as const;

type GlowButtonBase = {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "sell";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
};

type GlowButtonAsButton = GlowButtonBase &
    Omit<ComponentPropsWithoutRef<"button">, keyof GlowButtonBase> & {
        href?: undefined;
    };

type GlowButtonAsLink = GlowButtonBase &
    Omit<ComponentPropsWithoutRef<typeof Link>, keyof GlowButtonBase | "href"> & {
        href: ComponentPropsWithoutRef<typeof Link>["href"];
        disabled?: boolean;
    };

export type GlowButtonProps = GlowButtonAsButton | GlowButtonAsLink;

function buttonClassName({
    className = "",
    variant = "primary",
    size = "sm",
    fullWidth = false,
    disabled,
}: Pick<GlowButtonProps, "className" | "variant" | "size" | "fullWidth"> & {
    disabled?: boolean;
}) {
    return [
        "glow-btn",
        variant === "sell" ? "glow-btn--sell" : "",
        SIZE_CLASS[size],
        fullWidth ? "glow-btn--block" : "",
        disabled ? "is-disabled" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
}

export default function GlowButton(props: GlowButtonProps) {
    const className = buttonClassName(props);

    if (props.href != null) {
        const {
            children,
            className: _className,
            variant: _variant,
            size: _size,
            fullWidth: _fullWidth,
            href,
            disabled,
            onClick,
            ...linkProps
        } = props;

        return (
            <Link
                href={href}
                className={className}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : undefined}
                {...linkProps}
                onClick={(event) => {
                    if (disabled) {
                        event.preventDefault();
                        return;
                    }
                    onClick?.(event);
                }}
            >
                <span className="glow-btn__label">{children}</span>
            </Link>
        );
    }

    const {
        children,
        className: _className,
        variant: _variant,
        size: _size,
        fullWidth: _fullWidth,
        href: _href,
        ...buttonProps
    } = props;

    return (
        <button className={className} {...buttonProps}>
            <span className="glow-btn__label">{children}</span>
        </button>
    );
}
