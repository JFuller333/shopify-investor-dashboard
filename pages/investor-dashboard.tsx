import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { EditProjectModal } from "@/components/EditProjectModal";
import { ProjectCard } from "@/components/ProjectCard";
import { TrendingUp, DollarSign, BarChart3, Target, Zap, Building2, Leaf, Smartphone, ArrowUpRight, Calendar, Users, TrendingDown, Edit, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";

// Investment data - in a real app, this would come from an API
const initialInvestments = [
  {
    id: 1,
    title: "Tech Startup Alpha",
    description: "AI-powered productivity platform",
    category: "Technology",
    icon: Smartphone,
    invested: 50000,
    currentValue: 62500,
    roi: 25,
    status: "active",
    risk: "High",
    duration: "18 months",
    projectGoal: 500000, // Total funding goal for the entire project
    totalInvested: 375000 // Total invested by all investors combined
  },
  {
    id: 2,
    title: "Green Energy Project",
    description: "Solar panel manufacturing facility",
    category: "Clean Energy",
    icon: Leaf,
    invested: 75000,
    currentValue: 88500,
    roi: 18,
    status: "active",
    risk: "Medium",
    duration: "24 months",
    projectGoal: 750000, // Total funding goal for the entire project
    totalInvested: 525000 // Total invested by all investors combined
  },
  {
    id: 3,
    title: "Real Estate Fund",
    description: "Commercial property development",
    category: "Real Estate",
    icon: Building2,
    invested: 100000,
    currentValue: 115000,
    roi: 15,
    status: "active",
    risk: "Low",
    duration: "36 months",
    projectGoal: 1000000, // Total funding goal for the entire project
    totalInvested: 850000 // Total invested by all investors combined
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-success';
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

export default function InvestorDashboard() {
  const [investments, setInvestments] = useState(initialInvestments);
  const [filter, setFilter] = useState<'all' | 'active' | 'top-performers'>('all');

  // Load investments from localStorage on component mount
  useEffect(() => {
    const savedInvestments = localStorage.getItem('investor-investments');
    if (savedInvestments) {
      try {
        const parsedInvestments = JSON.parse(savedInvestments);
        // Merge with initial data to ensure new fields (projectGoal, totalInvested) are included
        const mergedInvestments = parsedInvestments.map((investment: any) => {
          const initial = initialInvestments.find(init => init.id === investment.id);
          return {
            ...initial, // Start with initial data (has projectGoal, totalInvested)
            ...investment, // Override with saved data (preserves user edits)
            icon: getIconComponent(investment.iconName || initial?.icon?.name)
          };
        });
        setInvestments(mergedInvestments);
      } catch (error) {
        console.error('Error loading investments from localStorage:', error);
      }
    }
  }, []);

  // Save investments to localStorage whenever investments change
  useEffect(() => {
    const investmentsToSave = investments.map(investment => ({
      ...investment,
      iconName: investment.icon.name || 'Smartphone' // Store icon name instead of component
    }));
    localStorage.setItem('investor-investments', JSON.stringify(investmentsToSave));
  }, [investments]);

  // Helper function to get icon component by name
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Smartphone': Smartphone,
      'Leaf': Leaf,
      'Building2': Building2,
      'Zap': Zap
    };
    return iconMap[iconName] || Smartphone;
  };
  
  const totalInvested = investments.reduce((sum, investment) => sum + (investment.invested || 0), 0);
  const totalValue = investments.reduce((sum, investment) => sum + (investment.currentValue || investment.invested || 0), 0);
  const totalGain = totalValue - totalInvested;
  const totalROI = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  const activeInvestments = investments.filter(i => i.status === 'active').length;
  const averageROI = investments.length > 0 ? investments.reduce((sum, investment) => sum + (investment.roi || 0), 0) / investments.length : 0;

  const handleProjectCreate = (newInvestment: any) => {
    setInvestments(prev => [newInvestment, ...prev]);
  };

  const handleInvestmentDelete = (investmentId: number) => {
    setInvestments(prev => prev.filter(i => i.id !== investmentId));
  };

  const handleInvestmentEdit = (updatedInvestment: any) => {
    setInvestments(prev => prev.map(i => i.id === updatedInvestment.id ? updatedInvestment : i));
  };

  const handleInvestmentView = (investmentId: number) => {
    // In a real app, this would navigate to investment details
    console.log('View investment:', investmentId);
  };

  const filteredInvestments = investments.filter(investment => {
    if (filter === 'all') return true;
    if (filter === 'active') return investment.status === 'active';
    if (filter === 'top-performers') return investment.roi > 15; // Top performers have ROI > 15%
    return true;
  });

  return (
    <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Investor Dashboard</h1>
              <p className="text-muted-foreground">Track your investment portfolio and returns</p>
            </div>
            <CreateProjectModal
              onProjectCreate={handleProjectCreate}
              userType="investor"
            />
          </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className={`text-xs ${totalGain >= 0 ? 'text-success' : 'text-danger'}`}>
              {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString()} total gain
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getROIColor(totalROI)}`}>
              {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">All time return</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInvestments}</div>
            <p className="text-xs text-muted-foreground">Out of {investments.length} total</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ROI</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getROIColor(averageROI)}`}>
              {averageROI >= 0 ? '+' : ''}{averageROI.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Per investment</p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Investments</h2>
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'active' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('active')}
              >
                Active
              </Button>
              <Button 
                variant={filter === 'top-performers' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('top-performers')}
              >
                Top Performers
              </Button>
            </div>
        </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredInvestments.length === 0 ? (
                <div className="col-span-full">
                  <Card className="p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/20">
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No investments found</h3>
                    <p className="text-muted-foreground mb-4">
                      {filter === 'all' 
                        ? "You haven't created any investments yet. Create your first investment to get started!"
                        : `No ${filter} investments found. Try changing the filter or create a new investment.`
                      }
                    </p>
                    <CreateProjectModal 
                      onProjectCreate={handleProjectCreate}
                      userType="investor"
                    />
                  </Card>
                </div>
              ) : (
                filteredInvestments.map((investment) => {
                  // Map investment data to ProjectCard format
                  // For investments: totalCost = invested amount, funded = current value
                  // projectGoal = total funding goal for the entire project
                  const totalCost = investment.invested || 0;
                  const funded = investment.currentValue || totalCost;
                  const roi = investment.roi || 0;
                  const timeline = investment.duration || "N/A";
                  const projectGoal = investment.projectGoal || null;
                  
                  return (
                    <ProjectCard
                      key={investment.id}
                      id={investment.id.toString()}
                      title={investment.title}
                      description={investment.description}
                      totalCost={totalCost}
                      funded={funded}
                      roi={roi}
                      timeline={timeline}
                      category={investment.category}
                      projectGoal={projectGoal}
                      isDonor={false}
                    />
                  );
                })
              )}
            </div>
      </div>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Your investment performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Performance chart will be displayed here</p>
              <p className="text-sm text-muted-foreground">Integration with charting library coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest investment activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/10">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium">Tech Startup Alpha</p>
                  <p className="text-sm text-muted-foreground">+$12,500 gain • 2 days ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-success">+25%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Green Energy Project</p>
                  <p className="text-sm text-muted-foreground">+$13,500 gain • 1 week ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-primary">+18%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-danger/5 border border-danger/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-danger/10">
                  <TrendingDown className="h-4 w-4 text-danger" />
                </div>
                <div>
                  <p className="font-medium">Crypto Mining Operation</p>
                  <p className="text-sm text-muted-foreground">-$6,000 loss • 2 weeks ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-danger">-20%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
