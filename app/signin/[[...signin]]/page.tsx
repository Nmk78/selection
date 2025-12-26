"use client";

import SignInForm from "@/components/auth/SignInForm";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";

export default function SignInPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gradient-to-br from-candidate-male-50 via-white to-candidate-female-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-candidate-male-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-candidate-female-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Unauthenticated>
          <SignInContent onSuccess={handleSuccess} />
        </Unauthenticated>
        <Authenticated>
          <AuthenticatedRedirect />
        </Authenticated>
      </div>
    </div>
  );
}

function SignInContent({ onSuccess }: { onSuccess: () => void }) {
  const hasUsers = useQuery(api.users.hasUsers);

  if (hasUsers === undefined) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full flex flex-col items-center gap-4"
      >
        <div className="relative">
          <Loader2 className="w-10 h-10 animate-spin text-candidate-male-600" />
          <div className="absolute inset-0 w-10 h-10 border-4 border-candidate-male-200 border-t-candidate-male-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-gray-600">Loading...</p>
      </motion.div>
    );
  }

  return <SignInForm onSuccess={onSuccess} />;
}

// function FirstAdminSetup() {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const createFirstAdminInvite = useMutation(api.users.createFirstAdminInvite);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     try {
//       await createFirstAdminInvite({ email });
//       setSuccess(true);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to create invite");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         <Card className="w-full max-w-md mx-auto shadow-xl border-green-200 bg-green-50/50">
//           <CardHeader className="text-center">
//             <CardTitle className="text-xl text-green-800">
//               Invite Created!
//             </CardTitle>
//             <CardDescription className="text-green-700">
//               You can now sign in with Google using {email}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <SignInForm />
//           </CardContent>
//         </Card>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <Card className="w-full max-w-md mx-auto shadow-xl border-Cprimary/20">
//         <CardHeader className="space-y-1 text-center">
//           <CardTitle className="text-2xl font-bold text-Cprimary">
//             Welcome!
//           </CardTitle>
//           <CardDescription className="text-muted-foreground">
//             Set up your first admin account
//           </CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-Cprimary">
//                 Your Google Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   type="email"
//                   placeholder="admin@gmail.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="pl-10 h-11"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Enter the Gmail address you&apos;ll use to sign in
//               </p>
//             </div>

//             {error && (
//               <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
//                 {error}
//               </div>
//             )}

//             <Button
//               type="submit"
//               className="w-full h-11 bg-Cprimary hover:bg-Cprimary/90"
//               disabled={isLoading || !email}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                   Creating...
//                 </>
//               ) : (
//                 "Create Admin Account"
//               )}
//             </Button>
//           </CardContent>
//         </form>
//       </Card>
//     </motion.div>
//   );
// }

function AuthenticatedRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin");
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <div className="absolute inset-0 w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-sm text-gray-600 font-medium">Redirecting to dashboard...</p>
    </motion.div>
  );
}
