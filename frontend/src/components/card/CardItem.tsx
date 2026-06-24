import { type Card } from "@/api/card";

interface CardItemProps {
  card: Card;
}

export default function CardItem({ card }: CardItemProps) {
  return (
    <div className="group flex items-start justify-between gap-1 rounded-md bg-[#1e2329] border border-white/5 px-2.5 py-2 hover:bg-[#252d36] hover:border-white/10 transition-colors cursor-pointer">
      <span className="flex-1 text-[0.8rem] text-gray-300 leading-snug break-words">{card.name}</span>
    </div>
  );
}
