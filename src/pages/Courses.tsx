import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Star, Play, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { courses, categories } from '@/data/coursesData';
import pageCourses from '@/assets/page-courses.png';

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <Layout>
      <SEO 
        title="Courses"
        description="Level up your career with our curated courses taught by successful African women. From leadership to finance, learn the skills you need to succeed."
      />
      
      {/* Hero Section with Illustration */}
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-100 via-coral-50 to-mint-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Level Up Your Career
              </h1>
              <p className="text-foreground/80 text-lg md:text-xl max-w-2xl mb-8">
                Expert-led courses designed to help ambitious women build the skills they need to thrive. Learn from the best, at your own pace.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link to="/member/signup">
                  <Button className="font-display uppercase tracking-wider">
                    Start Learning Free
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" className="font-display uppercase tracking-wider">
                    View Premium Plans
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img 
                src={pageCourses} 
                alt="Woman studying online" 
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="font-display uppercase tracking-wider"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {course.isFree ? (
                      <Badge className="bg-green-500 text-white">Free</Badge>
                    ) : (
                      <Badge className="bg-primary text-primary-foreground">Premium</Badge>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Play className="w-4 h-4" />
                      Preview
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">{course.category}</Badge>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons.length} lessons
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {course.students.toLocaleString()} students
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                      <p className="text-xs text-muted-foreground">{course.instructorTitle}</p>
                    </div>
                    <div className="text-right">
                      {course.isFree ? (
                        <span className="font-display font-bold text-green-600">Free</span>
                      ) : (
                        <span className="font-display font-bold text-foreground">${course.price}</span>
                      )}
                    </div>
                  </div>

                  <Link to={`/courses/${course.id}`}>
                    <Button 
                      className="w-full mt-4 font-display uppercase tracking-wider"
                      variant={course.isFree ? "default" : "outline"}
                    >
                      {course.isFree ? (
                        <>Start Learning</>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Enroll Now
                        </>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Unlock All Courses
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Get unlimited access to all premium courses, exclusive resources, and a supportive community of ambitious women.
          </p>
          <Link to="/pricing">
            <Button size="lg" className="font-display uppercase tracking-wider">
              View Membership Plans
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
