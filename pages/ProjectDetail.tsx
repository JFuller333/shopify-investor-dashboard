import { useRouter } from "next/router";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ROICalculator } from "@/components/ROICalculator";
import {
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  // Mock data - in real app, fetch based on id
  const project = {
    title: "Green Energy Initiative",
    description:
      "A comprehensive solar panel installation project targeting sustainable energy production with guaranteed long-term returns. This initiative focuses on commercial property installations with verified ROI tracking.",
    category: "Clean Energy",
    totalCost: 500000,
    funded: 375000,
    roi: 18,
    timeline: "24 months",
    minInvestment: 5000,
    investors: 43,
    status: "Active",
    milestones: [
      { title: "Project Planning", completed: true },
      { title: "Initial Funding Round", completed: true },
      { title: "Site Acquisition", completed: true },
      { title: "Installation Phase", completed: false },
      { title: "Operations & Returns", completed: false },
    ],
    risks: [
      { level: "Low", description: "Market volatility" },
      { level: "Medium", description: "Regulatory changes" },
      { level: "Low", description: "Technical challenges" },
    ],
  };

  const fundingProgress = (project.funded / project.totalCost) * 100;
  const remaining = project.totalCost - project.funded;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge>{project.category}</Badge>
              <Badge variant="outline">{project.status}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="mt-2 text-muted-foreground">{project.description}</p>
          </div>
          <Button size="lg" variant="success">
            Invest Now
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold">${project.totalCost.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-3">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected ROI</p>
                <p className="text-2xl font-bold">{project.roi}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-3">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="text-2xl font-bold">{project.timeline}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Funding Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{fundingProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={fundingProgress} className="h-3" />
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${project.funded.toLocaleString()} raised
                    </span>
                    <span className="font-medium text-primary">
                      ${remaining.toLocaleString()} remaining
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Min. Investment</p>
                    <p className="mt-1 text-lg font-semibold">
                      ${project.minInvestment.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Investors</p>
                    <p className="mt-1 text-lg font-semibold">{project.investors}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Project Milestones</h2>
              <div className="space-y-3">
                {project.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    {milestone.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Target className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span
                      className={
                        milestone.completed
                          ? "font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Risk Assessment</h2>
              <div className="space-y-3">
                {project.risks.map((risk, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <span>{risk.description}</span>
                    </div>
                    <Badge
                      variant={
                        risk.level === "Low"
                          ? "secondary"
                          : risk.level === "Medium"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {risk.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <ROICalculator />
          </div>
        </div>
      </div>
    </Layout>
  );
}
