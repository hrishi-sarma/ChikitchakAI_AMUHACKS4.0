
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, User, Tag, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogList from "@/components/blog/BlogList";
import { blogPosts } from "@/data/blogPosts";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from blog posts
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  
  // Filter posts based on search query and selected category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured posts (first 3 posts)
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <div className="w-full animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-poppins font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Health Blog
      </h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Featured posts slider */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredPosts.map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-medease-50 text-medease-700 dark:bg-medease-900/30 dark:text-medease-300">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.date}
                    </div>
                  </div>
                  <h3 className="font-medium text-lg line-clamp-2 hover:text-medease-600 dark:hover:text-medease-400">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="all" onClick={() => setSelectedCategory(null)}>All</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category}
                    value={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <BlogList posts={filteredPosts} />
              </TabsContent>
              
              {categories.map(category => (
                <TabsContent key={category} value={category} className="mt-0">
                  <BlogList posts={filteredPosts.filter(post => post.category === category)} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">Popular Categories</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge 
                      key={category} 
                      variant="outline" 
                      className={`cursor-pointer ${selectedCategory === category ? 'bg-medease-100 text-medease-800 dark:bg-medease-900 dark:text-medease-200' : ''}`}
                      onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">Recent Posts</h3>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80">
                  {blogPosts.slice(0, 5).map((post, index) => (
                    <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <Link to={`/blog/${post.slug}`} className="flex gap-3">
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium line-clamp-2 text-sm">{post.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                        </div>
                      </Link>
                      {index < 4 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">Subscribe to Newsletter</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Get the latest health tips and updates delivered to your inbox.
                </p>
                <Input 
                  placeholder="Your email address"
                  className="mb-3"
                />
                <Button className="w-full bg-medease-500 hover:bg-medease-600">
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
