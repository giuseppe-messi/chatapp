import clsx from "clsx";

type AvatarProps = {
  background: string;
  letter: string;
  size?: "sm" | "md";
};

export const Avatar = ({ background, letter, size = "md" }: AvatarProps) => {
  const styleOnSize: Record<NonNullable<AvatarProps["size"]>, string> = {
    sm: "text-[14px] size-4",
    md: "text-[16px] size-7"
  };

  return (
    <div
      className={clsx(
        "inline-flex items-center justify-center rounded-full text-white ring-1",
        styleOnSize[size]
      )}
      style={{ background }}
    >
      {letter}
    </div>
  );
};
