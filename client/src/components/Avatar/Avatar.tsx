type AvatarProps = {
  background: string;
  letter: string;
};

export const Avatar = ({ background, letter }: AvatarProps) => (
  <div className="w-[45px]">
    <div
      className={`inline-flex size-7 items-center justify-center rounded-full text-white text-[16px] ring-1`}
      style={{ background }}
    >
      {letter}
    </div>
  </div>
);
