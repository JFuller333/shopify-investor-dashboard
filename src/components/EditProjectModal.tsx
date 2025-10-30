import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Heart, Home, Shield, Smartphone, Leaf, Building2, Zap, Store } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description cannot exceed 500 characters"),
  category: z.string().min(1, "Please select a category"),
  goal: z.number().min(100, "Goal must be at least 100"),
  shopifyStoreUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
});

const investmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description cannot exceed 500 characters"),
  category: z.string().min(1, "Please select a category"),
  invested: z.number().min(100, "Investment amount must be at least 100"),
  currentValue: z.number().min(0, "Current value cannot be negative").optional(),
  roi: z.number().optional(),
  risk: z.string().min(1, "Please select a risk level"),
  duration: z.string().min(1, "Please enter a duration"),
  shopifyStoreUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
});

interface EditProjectModalProps {
  project: any;
  onProjectUpdate: (updatedProject: any) => void;
  userType: 'donor' | 'investor';
  children: React.ReactNode;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ 
  project, 
  onProjectUpdate, 
  userType, 
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goal: '',
    invested: '',
    currentValue: '',
    risk: '',
    duration: '',
    shopifyStoreUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        goal: userType === 'donor' ? (project.goal || '') : (project.invested || ''),
        invested: userType === 'investor' ? (project.invested || '') : '',
        currentValue: userType === 'investor' ? (project.currentValue || '') : '',
        risk: project.risk || '',
        duration: project.duration || '',
        shopifyStoreUrl: project.shopifyStoreUrl || '',
      });
    }
  }, [project, userType]);

  const resetForm = () => {
    setFormData({
      title: project?.title || '',
      description: project?.description || '',
      category: project?.category || '',
      goal: userType === 'donor' ? (project?.goal || '') : (project?.invested || ''),
      invested: userType === 'investor' ? (project?.invested || '') : '',
      currentValue: userType === 'investor' ? (project?.currentValue || '') : '',
      risk: project?.risk || '',
      duration: project?.duration || '',
      shopifyStoreUrl: project?.shopifyStoreUrl || '',
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const commonFields = { 
      title: formData.title, 
      description: formData.description, 
      category: formData.category 
    };
    
    let updatedProject: any = {};
    let validationResult;

    if (userType === 'donor') {
      updatedProject = {
        ...project,
        ...commonFields,
        goal: Number(formData.goal),
        shopifyStoreUrl: formData.shopifyStoreUrl || undefined,
      };
      validationResult = projectSchema.safeParse(updatedProject);
    } else { // investor
      const calculatedRoi = Number(formData.invested) > 0 && Number(formData.currentValue) > 0 
        ? ((Number(formData.currentValue) - Number(formData.invested)) / Number(formData.invested)) * 100 
        : (project.roi || 0);

      updatedProject = {
        ...project,
        ...commonFields,
        invested: Number(formData.invested),
        currentValue: Number(formData.currentValue) || Number(formData.invested),
        roi: calculatedRoi,
        risk: formData.risk,
        duration: formData.duration,
        shopifyStoreUrl: formData.shopifyStoreUrl || undefined,
      };
      validationResult = investmentSchema.safeParse(updatedProject);
    }

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(err => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setErrors({});
    onProjectUpdate(updatedProject);
    toast({
      title: "Success!",
      description: `${userType === 'donor' ? 'Project' : 'Investment'} updated successfully.`,
      variant: "default",
    });
    setIsOpen(false);
    setIsLoading(false);
  };

  const getCategoryOptions = () => {
    if (userType === 'donor') {
      return [
        { value: "Education", label: "Education", icon: BookOpen },
        { value: "Health", label: "Health", icon: Heart },
        { value: "Infrastructure", label: "Infrastructure", icon: Home },
        { value: "Safety", label: "Safety", icon: Shield },
      ];
    } else { // investor
      return [
        { value: "Technology", label: "Technology", icon: Smartphone },
        { value: "Clean Energy", label: "Clean Energy", icon: Leaf },
        { value: "Real Estate", label: "Real Estate", icon: Building2 },
        { value: "Cryptocurrency", label: "Cryptocurrency", icon: Zap },
      ];
    }
  };

  const getRiskOptions = () => {
    return [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "High", label: "High" },
    ];
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {userType === 'donor' ? 'Project' : 'Investment'}</DialogTitle>
          <DialogDescription>
            Update the details for your {userType === 'donor' ? 'project' : 'investment'}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="col-span-3"
            />
            {errors.title && <p className="col-span-4 text-right text-sm text-danger">{errors.title}</p>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="col-span-3"
            />
            {errors.description && <p className="col-span-4 text-right text-sm text-danger">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {getCategoryOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="col-span-4 text-right text-sm text-danger">{errors.category}</p>}
          </div>

          {userType === 'donor' ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goal" className="text-right">
                Goal Amount
              </Label>
              <Input
                id="goal"
                type="number"
                value={formData.goal}
                onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                className="col-span-3"
              />
              {errors.goal && <p className="col-span-4 text-right text-sm text-danger">{errors.goal}</p>}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="invested" className="text-right">
                  Invested Amount
                </Label>
                <Input
                  id="invested"
                  type="number"
                  value={formData.invested}
                  onChange={(e) => setFormData(prev => ({ ...prev, invested: e.target.value }))}
                  className="col-span-3"
                />
                {errors.invested && <p className="col-span-4 text-right text-sm text-danger">{errors.invested}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentValue" className="text-right">
                  Current Value
                </Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
                  className="col-span-3"
                />
                {errors.currentValue && <p className="col-span-4 text-right text-sm text-danger">{errors.currentValue}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="risk" className="text-right">
                  Risk Level
                </Label>
                <Select 
                  value={formData.risk} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, risk: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    {getRiskOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.risk && <p className="col-span-4 text-right text-sm text-danger">{errors.risk}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., 12 months, 2 years"
                />
                {errors.duration && <p className="col-span-4 text-right text-sm text-danger">{errors.duration}</p>}
              </div>
            </>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shopifyStoreUrl" className="text-right">
              Shopify Store URL
            </Label>
            <Input
              id="shopifyStoreUrl"
              value={formData.shopifyStoreUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, shopifyStoreUrl: e.target.value }))}
              className="col-span-3"
              placeholder="e.g., your-store.myshopify.com"
            />
            {errors.shopifyStoreUrl && <p className="col-span-4 text-right text-sm text-danger">{errors.shopifyStoreUrl}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : `Update ${userType === 'donor' ? 'Project' : 'Investment'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
