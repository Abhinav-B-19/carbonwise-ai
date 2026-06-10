interface Props {
    title: string;
    value: string | number;
  }
  
  export default function StatCard({
    title,
    value,
  }: Props) {
    return (
      <div
        className="
        bg-gradient-to-br
        from-green-500
        to-emerald-600
        text-white
        rounded-2xl
        p-6
        shadow-sm
        "
      >
        <p className="opacity-80">
          {title}
        </p>
  
        <h2
          className="
          text-3xl
          font-bold
          mt-2
          "
        >
          {value}
        </h2>
      </div>
    );
  }