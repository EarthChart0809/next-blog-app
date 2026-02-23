type Props = {
  value: number;
};

export const SevenSeg = ({ value }: Props) => {
  const digits = Math.max(0, value).toString().padStart(3, "0").split("");

  return (
    <div className="flex justify-center gap-2 font-mono">
      {digits.map((d, i) => (
        <div
          key={i}
          className="flex h-14 w-10 items-center justify-center border border-black bg-black text-3xl text-green-400"
        >
          {d}
        </div>
      ))}
    </div>
  );
};
