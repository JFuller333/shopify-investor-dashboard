import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Calendar,
  Users,
  ArrowLeft,
  Building2,
  Leaf,
  Smartphone,
  Zap,
  BookOpen,
  Heart,
  Home,
  Shield,
} from "lucide-react";
import Link from "next/link";

// Helper to get icon component by name
const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Smartphone: Smartphone,
    Leaf: Leaf,
    Building2: Building2,
    Zap: Zap,
    BookOpen: BookOpen,
    Heart: Heart,
    Home: Home,
    Shield: Shield,
  };
  return iconMap[iconName] || Smartphone;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-success';
    case 'completed': return 'bg-success';
    case 'nearly-complete': return 'bg-warning';
    case 'declining': return 'bg-danger';
    case 'mature': return 'bg-primary';
    default: return 'bg-muted';
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'High': return 'text-danger';
    case 'Medium': return 'text-warning';
    case 'Low': return 'text-success';
    default: return 'text-muted-foreground';
  }
};

const getROIColor = (roi: number) => {
  if (roi > 0) return 'text-success';
  if (roi < 0) return 'text-danger';
  return 'text-muted-foreground';
};

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projectType, setProjectType] = useState<'investor' | 'donor' | null>(null);

  useEffect(() => {
    if (!id) return;

    // Try to find project in investor investments
    const investorData = localStorage.getItem('investor-investments');
    if (investorData) {
      try {
        const investments = JSON.parse(investorData);
        const found = investments.find((inv: any) => inv.id.toString() === id.toString());
        if (found) {
          const projectWithIcon = {
            ...found,
            icon: getIconComponent(found.iconName),
          };
          setProject(projectWithIcon);
          setProjectType('investor');
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error loading investor project:', error);
      }
    }

    // Try to find project in donor projects
    const donorData = localStorage.getItem('donor-projects');
    if (donorData) {
      try {
        const projects = JSON.parse(donorData);
        const found = projects.find((proj: any) => proj.id.toString() === id.toString());
        if (found) {
          const projectWithIcon = {
            ...found,
            icon: getIconComponent(found.iconName),
          };
          setProject(projectWithIcon);
          setProjectType('donor');
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error loading donor project:', error);
      }
    }

    // Project not found
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="space-y-6">
          <Link href={projectType === 'donor' ? '/donor-dashboard' : '/investor-dashboard'}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/20">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link href={projectType === 'donor' ? '/donor-dashboard' : '/investor-dashboard'}>
              <Button>Go to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  // Handle investor project
  if (projectType === 'investor') {
    const invested = project.invested || 0;
    const currentValue = project.currentValue || invested;
    const gain = currentValue - invested;
    const gainPercent = invested > 0 ? (gain / invested) * 100 : 0;
    const Icon = project.icon;
    // Project Performance metrics (separate from individual ROI)
    const projectGoal = project.projectGoal || 0;
    const totalInvested = project.totalInvested || 0; // Total invested by all investors
    const projectProgress = projectGoal > 0 ? (totalInvested / projectGoal) * 100 : 0;
    const projectRemaining = projectGoal - totalInvested;

    return (
      <Layout>
        <div className="space-y-8">
          {/* Back Button */}
          <Link href="/investor-dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge>{project.category}</Badge>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(project.status)} text-white`}
                  >
                    {project.status}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold">{project.title}</h1>
                <p className="mt-2 text-muted-foreground">{project.description}</p>
              </div>
            </div>
            <Button size="lg" variant="default">
              Invest More
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentValue.toLocaleString()}</div>
                <p className={`text-xs ${gain >= 0 ? 'text-success' : 'text-danger'}`}>
                  {gain >= 0 ? '+' : ''}${gain.toLocaleString()} gain
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getROIColor(gainPercent)}`}>
                  {gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Return on investment</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.duration || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Investment period</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getRiskColor(project.risk)}`}>
                  {project.risk || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">Risk assessment</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* ROI Progress */}
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Investment Performance</h2>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ROI Progress</span>
                      <span className={`font-medium ${getROIColor(gainPercent)}`}>
                        {gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.abs(gainPercent)} 
                      className="h-3"
                    />
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Invested: ${invested.toLocaleString()}
                      </span>
                      <span className={`font-medium ${getROIColor(gainPercent)}`}>
                        {gain >= 0 ? '+' : ''}${gain.toLocaleString()} gain
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Project Performance */}
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Project Performance</h2>
                <div className="space-y-4">
                  {projectGoal > 0 ? (
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Project Funding Progress</span>
                        <span className="font-medium">{projectProgress.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={projectProgress} 
                        className="h-3"
                      />
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total Invested: ${totalInvested.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          ${projectRemaining.toLocaleString()} remaining
                        </span>
                      </div>
                      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-primary">Project Total Cost</span>
                          <span className="text-lg font-bold">${projectGoal.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total funding needed to complete the project
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Project performance data will be displayed here once project goal is set.
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Project Details */}
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Project Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="mt-1 font-medium">{project.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="mt-1 font-medium capitalize">{project.status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="mt-1 text-sm">{project.description}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <ROICalculator />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle donor project
  const raised = project.raised || 0;
  const goal = project.goal || 0;
  const progress = goal > 0 ? (raised / goal) * 100 : 0;
  const remaining = goal - raised;
  const Icon = project.icon;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Back Button */}
        <Link href="/donor-dashboard">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge>{project.category}</Badge>
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(project.status)} text-white`}
                >
                  {project.status}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <p className="mt-2 text-muted-foreground">{project.description}</p>
            </div>
          </div>
          <Button size="lg" variant="default">
            Donate Now
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${raised.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                of ${goal.toLocaleString()} goal
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Funding progress</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.donors || 0}</div>
              <p className="text-xs text-muted-foreground">Total contributors</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Left</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.daysLeft || 0}</div>
              <p className="text-xs text-muted-foreground">Remaining time</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Funding Progress */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Funding Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${raised.toLocaleString()} raised
                    </span>
                    <span className="font-medium text-primary">
                      ${remaining.toLocaleString()} remaining
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Project Details */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Project Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="mt-1 font-medium">{project.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Impact</p>
                    <p className={`mt-1 font-medium ${getRiskColor(project.impact || 'Medium')}`}>
                      {project.impact || 'Medium'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm">{project.description}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Impact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Tax Deductible</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-primary" />
                  <span>{project.donors || 0} donors supporting</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
