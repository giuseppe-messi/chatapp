import clsx from "clsx";

type StatusCircleProps = {
  isActive: boolean;
};

export const StatusCircle = ({ isActive }: StatusCircleProps) => (
  <span
    className={clsx(
      "w-2 h-2 rounded-full block",
      isActive ? "bg-green-600" : "bg-gray-400"
    )}
  />
);
