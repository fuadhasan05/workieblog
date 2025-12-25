import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/layout/PageTransition';
import { HeroNewsletter } from '@/components/home/HeroNewsletter';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { VideoSection } from '@/components/home/VideoSection';
import { OpenJobsSection } from '@/components/home/OpenJobsSection';
import { CareerCoursePromo } from '@/components/home/CareerCoursePromo';
import { JobsCTA } from '@/components/home/JobsCTA';
import { FreeGuidesSection } from '@/components/home/FreeGuidesSection';

const Index = () => {
  return (
    <Layout>
      <PageTransition>
        <HeroNewsletter />
        
        <div className="container mx-auto px-4 py-8">
          <CategoryTabs />
          <VideoSection />
          <OpenJobsSection />
          <CareerCoursePromo />
        </div>
        
        <JobsCTA />
        
        <div className="container mx-auto px-4 py-8">
          <FreeGuidesSection />
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Index;
