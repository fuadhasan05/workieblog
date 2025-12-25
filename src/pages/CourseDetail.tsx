import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, Clock, Users, Star, Play, Lock, CheckCircle, 
  ChevronLeft, PlayCircle, Award 
} from 'lucide-react';
import { courses } from '@/data/coursesData';
import { useMember } from '@/contexts/MemberContext';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { member, isAuthenticated, hasTier } = useMember();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  
  const course = courses.find(c => c.id === id);
  
  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-8">The course you're looking for doesn't exist.</p>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const canAccessPremium = course.isFree || (isAuthenticated && hasTier('PREMIUM', 'VIP'));
  const currentLesson = course.lessons.find(l => l.id === activeLesson);

  const handleLessonClick = (lessonId: string, lessonIsFree: boolean) => {
    if (lessonIsFree || canAccessPremium) {
      setActiveLesson(lessonId);
    } else if (!isAuthenticated) {
      navigate('/member/login');
    } else {
      navigate('/pricing');
    }
  };

  return (
    <Layout>
      <SEO 
        title={`${course.title} | Courses`}
        description={course.description}
      />
      
      {/* Back Navigation */}
      <div className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/courses" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Courses
          </Link>
        </div>
      </div>

      {/* Course Header */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                {course.isFree ? (
                  <Badge className="bg-green-500 text-white">Free</Badge>
                ) : (
                  <Badge className="bg-amber-500 text-white">Premium</Badge>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                {course.title}
              </h1>
              <p className="text-primary-foreground/80 text-lg mb-6">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-primary-foreground/80">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.lessons.length} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.students.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1 text-yellow-300">
                  <Star className="w-4 h-4 fill-current" />
                  {course.rating}
                </span>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                  <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-primary-foreground">{course.instructor}</p>
                  <p className="text-sm text-primary-foreground/70">{course.instructorTitle}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full rounded-lg shadow-2xl"
              />
              {!activeLesson && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="gap-2"
                    onClick={() => handleLessonClick(course.lessons[0].id, course.lessons[0].isFree)}
                  >
                    <PlayCircle className="w-6 h-6" />
                    Start Course
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Video Player & Lesson Content */}
            <div className="lg:col-span-2 space-y-8">
              {activeLesson && currentLesson && (
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-black">
                    <iframe
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <CardContent className="p-6">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                      {currentLesson.title}
                    </h2>
                    <p className="text-muted-foreground">{currentLesson.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* About Course */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">About This Course</h2>
                  <p className="text-muted-foreground mb-6">{course.longDescription}</p>
                  
                  <h3 className="font-display text-lg font-bold text-foreground mb-3">What You'll Learn</h3>
                  <ul className="space-y-2">
                    {course.whatYouLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Instructor Card */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">Your Instructor</h2>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                      <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">{course.instructor}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{course.instructorTitle}</p>
                      <p className="text-muted-foreground">{course.instructorBio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lessons Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-display text-lg font-bold text-foreground">Course Content</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.lessons.length} lessons • {course.duration}
                    </p>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {course.lessons.map((lesson, index) => {
                      const isAccessible = lesson.isFree || canAccessPremium;
                      const isActive = activeLesson === lesson.id;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson.id, lesson.isFree)}
                          className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${
                            isActive ? 'bg-secondary' : ''
                          } ${!isAccessible ? 'opacity-60' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                            }`}>
                              {isAccessible ? (
                                <Play className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-muted-foreground">Lesson {index + 1}</span>
                                {lesson.isFree && !course.isFree && (
                                  <Badge variant="outline" className="text-xs">Free Preview</Badge>
                                )}
                              </div>
                              <h4 className="font-medium text-foreground text-sm line-clamp-2">
                                {lesson.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {lesson.duration}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Enrollment CTA */}
                  {!canAccessPremium && (
                    <div className="p-4 border-t border-border bg-secondary/30">
                      <div className="text-center mb-4">
                        <span className="font-display text-2xl font-bold text-foreground">${course.price}</span>
                        <p className="text-sm text-muted-foreground">or included with Premium</p>
                      </div>
                      {!isAuthenticated ? (
                        <div className="space-y-2">
                          <Link to="/member/signup" className="block">
                            <Button className="w-full font-display uppercase tracking-wider">
                              Sign Up to Enroll
                            </Button>
                          </Link>
                          <Link to="/member/login" className="block">
                            <Button variant="outline" className="w-full font-display uppercase tracking-wider">
                              Login
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <Link to="/pricing" className="block">
                          <Button className="w-full font-display uppercase tracking-wider">
                            <Award className="w-4 h-4 mr-2" />
                            Upgrade to Premium
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
