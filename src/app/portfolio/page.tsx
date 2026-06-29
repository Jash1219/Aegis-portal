import PortfolioContent from "@/components/portfolio/PortfolioContent";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-8 pt-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-lg">
        <PortfolioContent />
      </div>
    </div>
  );
}
