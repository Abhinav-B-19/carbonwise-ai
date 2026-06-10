interface Props {
    className?: string;
  }
  
  export default function Skeleton({
    className,
  }: Props) {
    return (
      <div
        className={`
        animate-pulse
        bg-slate-200
        rounded-xl
        ${className}
        `}
      />
    );
  }