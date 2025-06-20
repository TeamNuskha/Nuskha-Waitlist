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
import { Users, CheckCircle, Mail, Loader2 } from "lucide-react";
import logoPath from "@assets/logopng_1750416341824.png";
import backgroundPath from "@assets/landingpageBG_1750459638564.png";
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
  const { data: countData, isLoading: countLoading } = useQuery<{ count: number }>({
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
    <div 
      className="font-[Inter] min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundPath})` }}
    >
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src={logoPath} 
              alt="Logo" 
              className="h-8 w-auto"
            />
          </div>
          <div className="text-black text-sm font-medium">
            Coming Soon
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative px-4 pb-20 pt-8">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Hero Content */}
          <div className="mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight" style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 700 }}>
              Desi Wisdom meets the Digital Age
            </h1>
            
            <p className="text-xl text-black mb-8 leading-relaxed" style={{ fontFamily: 'Satoshi, sans-serif', fontWeight: 400 }}>
              Thousands are already signing up to rediscover everyday wisdom from our roots. Join them and see how Nuskha brings tradition into the digital age.
            </p>
          </div>

          {/* Waitlist Form Card */}
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-8 animate-scale-in">
            {isSuccess ? (
              // Success State
              <div className="text-center py-8">
                <div className="text-2xl font-semibold text-black mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  ✅ You're on the list! We'll be in touch soon.
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
                        <FormLabel className="block text-sm font-medium text-black mb-2">
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email address"
                              required
                              className="w-full px-4 py-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 text-black placeholder-black/50 pr-10 bg-white/30"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <Mail size={16} className="text-black/50" />
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
                    className="w-full text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    style={{ backgroundColor: '#e08d3b' }}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding you to the list...
                      </>
                    ) : (
                      "Let me know"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            <p className="text-xs text-black/60 mt-4 text-center">
              No spam, ever. Unsubscribe at any time.
            </p>
          </div>

          {/* Counter Section */}
          <div className="p-4 animate-fade-in">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Users size={14} className="text-black" />
                  <span className="text-sm font-medium text-black">People waiting</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-black">
                  {countLoading ? (
                    <div className="animate-pulse">-</div>
                  ) : (
                    currentCount.toLocaleString()
                  )}
                </div>
              </div>
            </div>
            
            {/* Live indicator */}
            <div className="flex items-center justify-center mt-3 space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-black/60">Live counter</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
