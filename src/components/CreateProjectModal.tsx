import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, DollarSign, Target, Calendar, Users, Store, Heart, BookOpen, Home, Shield, Zap, Building2, Leaf, Smartphone } from "lucide-react";

interface CreateProjectModalProps {
  onProjectCreate: (project: any) => void;
  userType: 'donor' | 'investor';
}

const projectTypes = {
  donor: [
    { value: 'education', label: 'Education', icon: BookOpen, color: 'bg-primary' },
    { value: 'health', label: 'Health', icon: Heart, color: 'bg-danger' },
    { value: 'infrastructure', label: 'Infrastructure', icon: Home, color: 'bg-warning' },
    { value: 'safety', label: 'Safety', icon: Shield, color: 'bg-success' },
    { value: 'shopify', label: 'Shopify Store', icon: Store, color: 'bg-accent' }
  ],
  investor: [
    { value: 'technology', label: 'Technology', icon: Smartphone, color: 'bg-primary' },
    { value: 'clean-energy', label: 'Clean Energy', icon: Leaf, color: 'bg-success' },
    { value: 'real-estate', label: 'Real Estate', icon: Building2, color: 'bg-warning' },
    { value: 'cryptocurrency', label: 'Cryptocurrency', icon: Zap, color: 'bg-danger' },
    { value: 'shopify', label: 'Shopify Store', icon: Store, color: 'bg-accent' }
  ]
};

const impactLevels = [
  { value: 'low', label: 'Low Impact', color: 'text-muted-foreground' },
  { value: 'medium', label: 'Medium Impact', color: 'text-warning' },
  { value: 'high', label: 'High Impact', color: 'text-success' },
  { value: 'critical', label: 'Critical Impact', color: 'text-danger' }
];

const riskLevels = [
  { value: 'low', label: 'Low Risk', color: 'text-success' },
  { value: 'medium', label: 'Medium Risk', color: 'text-warning' },
  { value: 'high', label: 'High Risk', color: 'text-danger' }
];

export function CreateProjectModal({ onProjectCreate, userType }: CreateProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goal: '',
    duration: '',
    impact: '',
    risk: '',
    shopifyStore: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProject = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      icon: projectTypes[userType].find(p => p.value === formData.category)?.icon || Store,
      goal: parseInt(formData.goal),
      raised: 0,
      donors: 0,
      daysLeft: parseInt(formData.duration),
      status: 'active',
      impact: formData.impact,
      risk: formData.risk,
      shopifyStore: formData.shopifyStore,
      // Investment-specific properties
      ...(userType === 'investor' && {
        invested: parseInt(formData.goal),
        currentValue: parseInt(formData.goal), // Start with same value as invested
        roi: 0, // Start with 0% ROI
        duration: `${formData.duration} months` // Convert days to months for display
      })
    };

    onProjectCreate(newProject);
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      goal: '',
      duration: '',
      impact: '',
      risk: '',
      shopifyStore: ''
    });
    setIsLoading(false);
  };

  const selectedCategory = projectTypes[userType].find(p => p.value === formData.category);
  const isShopifyProject = formData.category === 'shopify';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New {userType === 'donor' ? 'Donation' : 'Investment'} Project
          </DialogTitle>
          <DialogDescription>
            Set up a new project to track {userType === 'donor' ? 'donations and impact' : 'investments and returns'}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Project Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {projectTypes[userType].map((type) => {
                const Icon = type.icon;
                return (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData.category === type.value
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, category: type.value }))}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ${type.color}/10`}>
                        <Icon className={`h-5 w-5 ${type.color.replace('bg-', 'text-')}`} />
                      </div>
                      <p className="text-sm font-medium">{type.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="Enter project title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">
                {userType === 'donor' ? 'Funding Goal' : 'Investment Amount'} ($)
              </Label>
              <Input
                id="goal"
                type="number"
                placeholder="50000"
                value={formData.goal}
                onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project goals and impact..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          {/* Shopify Store Integration */}
          {isShopifyProject && (
            <div className="space-y-2 p-4 bg-accent/20 rounded-lg border border-accent/30">
              <Label htmlFor="shopifyStore" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Shopify Store URL
              </Label>
              <Input
                id="shopifyStore"
                placeholder="your-store.myshopify.com"
                value={formData.shopifyStore}
                onChange={(e) => setFormData(prev => ({ ...prev, shopifyStore: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Connect your Shopify store to track real-time sales and performance data.
              </p>
            </div>
          )}

          {/* Project Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">
                {userType === 'donor' ? 'Campaign Duration' : 'Investment Duration'} (days)
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="impact">Impact Level</Label>
              <Select value={formData.impact} onValueChange={(value) => setFormData(prev => ({ ...prev, impact: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select impact level" />
                </SelectTrigger>
                <SelectContent>
                  {impactLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {userType === 'investor' && (
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Level</Label>
                <Select value={formData.risk} onValueChange={(value) => setFormData(prev => ({ ...prev, risk: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <span className={level.color}>{level.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Project Preview */}
          {selectedCategory && formData.title && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Project Preview</Label>
              <Card className="p-4 bg-muted/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${selectedCategory.color}/10`}>
                    <selectedCategory.icon className={`h-5 w-5 ${selectedCategory.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{formData.title || 'Project Title'}</h4>
                    <p className="text-sm text-muted-foreground">{selectedCategory.label}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${formData.goal || '0'} goal
                  </Badge>
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formData.duration || '0'} days
                  </Badge>
                  {formData.impact && (
                    <Badge variant="secondary">
                      <Target className="h-3 w-3 mr-1" />
                      {formData.impact} impact
                    </Badge>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
