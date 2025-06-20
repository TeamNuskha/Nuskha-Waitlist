import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWaitlistRegistrationSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Smartphone, Rocket, Zap, Shield, Sparkles, Users, CheckCircle, Mail, Loader2 } from "lucide-react";
import type { z } from "zod";

type FormData = z.infer<typeof insertWaitlistRegistrationSchema>;

export default function WaitlistPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(insertWaitlistRegistrationSchema),
    defaultValues: {
      email: "",
    },
  });

  // Query to get current waitlist count
  const { data: countData, isLoading: countLoading } = useQuery({
    queryKey: ["/api/waitlist/count"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mutation to register for waitlist
  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/waitlist/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist/count"] });
      toast({
        title: "Welcome to the waitlist! 🎉",
        description: "We'll notify you as soon as we launch.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message.includes("already registered") 
          ? "This email is already on our waitlist!"
          : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(data);
  };

  const currentCount = countData?.count || 1947;

  return (
    <div className="font-[Inter] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Smartphone size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">MobileApp</span>
          </div>
          <div className="text-slate-600 text-sm font-medium">
            Coming Soon
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative px-4 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Hero Content */}
          <div className="mb-12 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-indigo-200 mb-6">
              <Rocket size={16} className="text-indigo-500 mr-2" />
              <span className="text-sm font-medium text-slate-700">Revolutionary Mobile Experience</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Get Early Access to{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                The Future
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Join thousands of users waiting for the next breakthrough in mobile productivity. 
              Be among the first to experience innovation that will change how you work and play.
            </p>
          </div>

          {/* Waitlist Form Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-8 animate-scale-in">
            {isSuccess ? (
              // Success State
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="text-emerald-500 mr-3" size={20} />
                  <div>
                    <h3 className="font-semibold text-emerald-800">You're on the list!</h3>
                    <p className="text-sm text-emerald-600 mt-1">We'll notify you as soon as we launch.</p>
                  </div>
                </div>
              </div>
            ) : (
              // Form
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email address"
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-slate-900 placeholder-slate-400 pr-10"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <Mail size={16} className="text-slate-400" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm text-red-600 flex items-center mt-2">
                          {form.formState.errors.email && (
                            <>
                              <span className="mr-1">⚠️</span>
                              {form.formState.errors.email.message}
                            </>
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding you to the list...
                      </>
                    ) : (
                      "Join the Waitlist"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            <p className="text-xs text-slate-500 mt-4 text-center">
              No spam, ever. Unsubscribe at any time.
            </p>
          </div>

          {/* Counter Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6 animate-fade-in">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Users size={16} className="text-indigo-500" />
                  <span className="text-sm font-medium text-slate-600">People waiting</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900">
                  {countLoading ? (
                    <div className="animate-pulse">-</div>
                  ) : (
                    currentCount.toLocaleString()
                  )}
                </div>
              </div>
            </div>
            
            {/* Live indicator */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500">Live counter</span>
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-sm text-slate-600">Built for speed and performance on all devices</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-slate-600">Your data is encrypted and never shared</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI Powered</h3>
              <p className="text-sm text-slate-600">Smart features that adapt to your workflow</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-white/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-slate-500">
            © 2024 MobileApp. All rights reserved.{" "}
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a> ·{" "}
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
