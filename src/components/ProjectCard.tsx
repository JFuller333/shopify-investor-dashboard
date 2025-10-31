import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  totalCost: number;
  funded: number;
  roi: number;
  timeline: string;
  category: string;
  projectGoal?: number; // Total project funding goal (separate from user's investment)
}

export const ProjectCard = ({
  id,
  title,
  description,
  totalCost,
  funded,
  roi,
  timeline,
  category,
  projectGoal,
  isDonor = false,
}: ProjectCardProps & { isDonor?: boolean }) => {
  const fundingProgress = (funded / totalCost) * 100;
  const remaining = totalCost - funded;
  // For investors: show project goal if provided (project's total funding goal)
  // For donors: project goal is the same as totalCost, so don't show separately
  const showProjectGoal = projectGoal && !isDonor;

  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium">
              {category}
            </span>
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {!isDonor ? (
          // Investor view: Show individual return and project total cost
          <>
            <div className="space-y-3">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Your Return</span>
                  <span className="font-medium">{fundingProgress.toFixed(1)}%</span>
                </div>
                <Progress value={fundingProgress} className="h-2" />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    ${funded.toLocaleString()} / ${totalCost.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    ${remaining.toLocaleString()} gain
                  </span>
                </div>
              </div>
              {projectGoal && (
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Project Total Cost</span>
                    <span className="text-sm font-semibold text-foreground">${projectGoal.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Donor view: Show standard funding progress
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Funding Progress</span>
              <span className="font-medium">{fundingProgress.toFixed(1)}%</span>
            </div>
            <Progress value={fundingProgress} className="h-2" />
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                ${funded.toLocaleString()} / ${totalCost.toLocaleString()}
              </span>
              <span className="text-muted-foreground">
                ${remaining.toLocaleString()} remaining
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
          {!isDonor && (
            <div>
              <p className="text-xs text-muted-foreground">Expected ROI</p>
              <div className="mt-1 flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-xl font-semibold text-success">{roi}%</span>
              </div>
            </div>
          )}
          {isDonor && (
            <div>
              <p className="text-xs text-muted-foreground">Impact</p>
              <p className="mt-1 text-sm font-medium">Tax Deductible</p>
            </div>
          )}
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Timeline</p>
            <p className="mt-1 text-sm font-medium">{timeline}</p>
          </div>
        </div>

        <Link href={`/project/${id}`}>
          <Button className="w-full" variant="default">
            View Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
