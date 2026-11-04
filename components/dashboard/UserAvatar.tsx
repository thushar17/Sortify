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
        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted text-xs font-medium text-muted-foreground",
        className
      )}
      aria-label={name || email || "User avatar"}
      role="img"
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <span className={cn(textClassName)}>{initials}</span>
      )}
    </div>
  );
}
