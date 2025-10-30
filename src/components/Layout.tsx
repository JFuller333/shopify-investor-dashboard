import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, User, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Image from "next/image";
import logo from "@/assets/lets-rebuild-logo.png";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [dashboardPath, setDashboardPath] = useState("/donor-dashboard");
  const isActive = (path: string) => router.pathname === path;

  useEffect(() => {
    const getUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (roleData?.role === "investor") {
          setDashboardPath("/investor-dashboard");
        } else {
          setDashboardPath("/donor-dashboard");
        }
      }
    };

    getUserRole();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href={dashboardPath} className="flex items-center">
              <Image src={logo} alt="Let's Rebuild Tuskegee" className="h-12" width={48} height={48} />
            </Link>
            
            <div className="flex items-center gap-6">
              <Link
                href={dashboardPath}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive(dashboardPath)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
                  <Link
                    href="/shopify-management"
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive("/shopify-management")
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    Shopify
                  </Link>
              <Link
                href="/profile"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive("/profile")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
