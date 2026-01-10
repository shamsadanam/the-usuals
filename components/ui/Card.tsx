import Link from "next/link";
import { ReactNode } from "react";

type CardProps = {
  title: string;
  description?: string;
  href?: string;
  children?: ReactNode;
  className?: string;
};

export function Card({
  title,
  description,
  href,
  children,
  className = "",
}: CardProps) {
  const baseClasses =
    "w-full rounded-xl border border-zinc-800 p-5 transition border-zinc-600 bg-zinc-900";

  const content = (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-medium leading-tight">{title}</h3>

        {description && <p className="text-sm text-zinc-400">{description}</p>}
      </div>

      {/* Custom content */}
      {children && <div className="pt-2">{children}</div>}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} block ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`${baseClasses} ${className}`}>{content}</div>;
}
