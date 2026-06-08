import { cn } from "@/lib/utils";

type Props = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  className?: string;
  textClassName?: string;
};

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "S";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function UserAvatar({
  name,
  email,
  image,
  className,
  textClassName,
}: Props) {
  const initials = getInitials(name, email);

  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(79,70,229,0.24)]",
        image && "bg-center bg-cover bg-no-repeat",
        className
      )}
      style={image ? { backgroundImage: `url(${image})` } : undefined}
      aria-label={name || email || "User avatar"}
      role="img"
    >
      {!image ? <span className={cn(textClassName)}>{initials}</span> : null}
    </div>
  );
}
