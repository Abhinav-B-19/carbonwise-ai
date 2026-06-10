interface Props {
    insight: string;
  }
  
  export default function AiInsightCard({
    insight,
  }: Props) {
    return (
      <div
        className="
        bg-gradient-to-r
        from-emerald-500
        to-green-600
        text-white
        rounded-2xl
        p-6
        "
      >
        <h3 className="font-bold mb-3">
          AI Sustainability Insight
        </h3>
  
        <p>{insight}</p>
      </div>
    );
  }