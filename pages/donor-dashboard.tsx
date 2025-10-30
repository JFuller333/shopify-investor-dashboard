import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { EditProjectModal } from "@/components/EditProjectModal";
import { TrendingUp, DollarSign, Users, Target, Heart, BookOpen, Shield, Home, Calendar, ArrowUpRight, Edit, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";

// Project data - in a real app, this would come from an API
const initialProjects = [
  {
    id: 1,
    title: "Education Fund",
    description: "Supporting local schools with technology and resources",
    category: "Education",
    icon: BookOpen,
    goal: 50000,
    raised: 37500,
    donors: 234,
    daysLeft: 15,
    status: "active",
    impact: "High"
  },
  {
    id: 2,
    title: "Healthcare Initiative",
    description: "Providing medical care to underserved communities",
    category: "Health",
    icon: Heart,
    goal: 75000,
    raised: 68000,
    donors: 189,
    daysLeft: 8,
    status: "nearly-complete",
    impact: "Critical"
  },
  {
    id: 3,
    title: "Community Development",
    description: "Building infrastructure and community centers",
    category: "Infrastructure",
    icon: Home,
    goal: 100000,
    raised: 25000,
    donors: 156,
    daysLeft: 45,
    status: "active",
    impact: "Medium"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-success';
    case 'nearly-complete': return 'bg-warning';
    case 'active': return 'bg-primary';
    default: return 'bg-muted';
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'Critical': return 'text-danger';
    case 'High': return 'text-success';
    case 'Medium': return 'text-warning';
    default: return 'text-muted-foreground';
  }
};

export default function DonorDashboard() {
  const [projects, setProjects] = useState(initialProjects);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Load projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('donor-projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        // Convert icon strings back to icon components
        const projectsWithIcons = parsedProjects.map((project: any) => ({
          ...project,
          icon: getIconComponent(project.iconName)
        }));
        setProjects(projectsWithIcons);
      } catch (error) {
        console.error('Error loading projects from localStorage:', error);
      }
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    const projectsToSave = projects.map(project => ({
      ...project,
      iconName: project.icon.name || 'BookOpen' // Store icon name instead of component
    }));
    localStorage.setItem('donor-projects', JSON.stringify(projectsToSave));
  }, [projects]);

  // Helper function to get icon component by name
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'BookOpen': BookOpen,
      'Heart': Heart,
      'Home': Home,
      'Shield': Shield
    };
    return iconMap[iconName] || BookOpen;
  };
  
  const totalDonated = projects.reduce((sum, project) => sum + project.raised, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalDonors = projects.reduce((sum, project) => sum + project.donors, 0);

  const handleProjectCreate = async (newProject: any) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProjects(prev => [newProject, ...prev]);
    setIsLoading(false);
  };

  const handleProjectDelete = (projectId: number) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleProjectEdit = (updatedProject: any) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleProjectView = (projectId: number) => {
    // In a real app, this would navigate to project details
    console.log('View project:', projectId);
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'active') return project.status === 'active';
    if (filter === 'completed') return project.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Donor Dashboard</h1>
              <p className="text-muted-foreground">Track your donations and their impact</p>
            </div>
            <CreateProjectModal
              onProjectCreate={handleProjectCreate}
              userType="donor"
            />
          </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDonated.toLocaleString()}</div>
            <p className="text-xs text-success">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">+2 new this month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-success">+1 this month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDonors}</div>
            <p className="text-xs text-muted-foreground">Total donors</p>
          </CardContent>
        </Card>
      </div>

      {/* Project Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Projects</h2>
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
                variant={filter === 'completed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
            </div>
        </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full">
                  <Card className="p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/20">
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No projects found</h3>
                    <p className="text-muted-foreground mb-4">
                      {filter === 'all' 
                        ? "You haven't created any projects yet. Create your first project to get started!"
                        : `No ${filter} projects found. Try changing the filter or create a new project.`
                      }
                    </p>
                    <CreateProjectModal 
                      onProjectCreate={handleProjectCreate}
                      userType="donor"
                    />
                  </Card>
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const progress = (project.raised / project.goal) * 100;
                  const Icon = project.icon;
                  
                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{project.title}</CardTitle>
                              <p className="text-sm text-muted-foreground">{project.category}</p>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(project.status)} text-white`}
                          >
                            {project.status === 'nearly-complete' ? 'Nearly Complete' : project.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">${project.raised.toLocaleString()}</span>
                            <span className="text-muted-foreground">of ${project.goal.toLocaleString()}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{Math.round(progress)}% funded</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {project.daysLeft > 0 ? `${project.daysLeft} days left` : 'Completed'}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {project.donors} donors
                            </span>
                            <span className={`font-medium ${getImpactColor(project.impact)}`}>
                              {project.impact} Impact
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleProjectView(project.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          <EditProjectModal
                            project={project}
                            onProjectUpdate={handleProjectEdit}
                            userType="donor"
                          >
                            <Button 
                              size="sm" 
                              variant="outline"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </EditProjectModal>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleProjectDelete(project.id)}
                              className="text-danger hover:text-danger hover:bg-danger/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest donation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/10">
                  <Heart className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium">Healthcare Initiative</p>
                  <p className="text-sm text-muted-foreground">Donated $1,000 • 2 days ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-success">+$1,000</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Education Fund</p>
                  <p className="text-sm text-muted-foreground">Donated $500 • 1 week ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-primary">+$500</span>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-warning/10">
                  <Home className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="font-medium">Community Development</p>
                  <p className="text-sm text-muted-foreground">Donated $750 • 2 weeks ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-warning">+$750</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
