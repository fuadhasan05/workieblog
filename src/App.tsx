import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { MemberProvider } from "./contexts/MemberContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";

// Public pages
import Index from "./pages/Index";
import Article from "./pages/Article";
import SearchResults from "./pages/SearchResults";
import Videos from "./pages/Videos";
import Video from "./pages/Video";
import Category from "./pages/Category";
import Author from "./pages/Author";
import TagPage from "./pages/Tag";
import Newsletters from "./pages/Newsletters";
import Advertise from "./pages/Advertise";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Pricing from "./pages/PricingEnhanced";
import Resources from "./pages/Resources";
import Podcast from "./pages/Podcast";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import JobDetail from "./pages/JobDetail";
import NotFound from "./pages/NotFound";

// Member pages
import MemberSignup from "./pages/member/Signup";
import MemberLogin from "./pages/member/Login";
import MemberDashboard from "./pages/member/Dashboard";

// Admin pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Posts from "./pages/admin/Posts";
import PostEditor from "./pages/admin/PostEditor";
import Categories from "./pages/admin/Categories";
import Tags from "./pages/admin/Tags";
import Media from "./pages/admin/Media";
import Team from "./pages/admin/Team";
import Members from "./pages/admin/Members";
import Subscribers from "./pages/admin/Subscribers";
import Analytics from "./pages/admin/Analytics";
import AdminJobs from "./pages/admin/Jobs";
import AdminResources from "./pages/admin/Resources";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ThemeProvider defaultTheme="system" storageKey="workherholic-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MemberProvider>
              <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/article/:slug" element={<Article />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/video/:slug" element={<Video />} />
                <Route path="/category/:slug" element={<Category />} />
                <Route path="/author/:slug" element={<Author />} />
                <Route path="/tag/:slug" element={<TagPage />} />
                <Route path="/newsletters" element={<Newsletters />} />
                <Route path="/advertise" element={<Advertise />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/podcast" element={<Podcast />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/jobs/post" element={<PostJob />} />

                {/* Member routes */}
                <Route path="/member/signup" element={<MemberSignup />} />
                <Route path="/member/login" element={<MemberLogin />} />
                <Route path="/member/dashboard" element={<MemberDashboard />} />

                {/* Admin login */}
                <Route path="/admin/login" element={<Login />} />

              {/* Protected admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="posts" element={<Posts />} />
                <Route path="posts/:id/edit" element={<PostEditor />} />
                <Route path="posts/new" element={<PostEditor />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="resources" element={<AdminResources />} />
                <Route path="categories" element={<Categories />} />
                <Route path="tags" element={<Tags />} />
                <Route path="media" element={<Media />} />
                <Route path="team" element={<Team />} />
                <Route path="members" element={<Members />} />
                <Route path="subscribers" element={<Subscribers />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </MemberProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
