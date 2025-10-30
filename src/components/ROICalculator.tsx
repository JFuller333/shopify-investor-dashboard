import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";

export const ROICalculator = () => {
  const [investment, setInvestment] = useState<string>("");
  const [roiRate, setRoiRate] = useState<string>("15");
  const [timeline, setTimeline] = useState<string>("12");

  const calculateReturns = () => {
    const investmentAmount = parseFloat(investment) || 0;
    const rate = parseFloat(roiRate) || 0;
    const months = parseFloat(timeline) || 0;
    
    const yearlyReturn = (investmentAmount * rate) / 100;
    const monthlyReturn = yearlyReturn / 12;
    const totalReturn = monthlyReturn * months;
    const finalAmount = investmentAmount + totalReturn;

    return {
      totalReturn: totalReturn.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      monthlyReturn: monthlyReturn.toFixed(2),
    };
  };

  const results = calculateReturns();

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">ROI Calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="investment">Investment Amount ($)</Label>
          <Input
            id="investment"
            type="number"
            placeholder="10000"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="roi">Expected ROI (%)</Label>
          <Input
            id="roi"
            type="number"
            placeholder="15"
            value={roiRate}
            onChange={(e) => setRoiRate(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="timeline">Timeline (months)</Label>
          <Input
            id="timeline"
            type="number"
            placeholder="12"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="mt-6 space-y-3 rounded-lg bg-accent/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Return</span>
            <span className="font-semibold">${results.monthlyReturn}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Return</span>
            <span className="font-semibold text-success">${results.totalReturn}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-sm font-medium">Final Amount</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xl font-bold">${results.finalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
