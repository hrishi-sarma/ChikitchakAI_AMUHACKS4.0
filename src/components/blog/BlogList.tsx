
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blog";

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground">No posts found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <Card key={post.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <div className="md:w-2/3 p-4 md:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-medease-50 text-medease-700 dark:bg-medease-900/30 dark:text-medease-300">
                    {post.category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {post.date}
                  </div>
                </div>
                <h3 className="font-medium text-xl mb-2 hover:text-medease-600 dark:hover:text-medease-400">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <img src={post.author.avatar} alt={post.author.name} />
                  </Avatar>
                  <span className="text-sm font-medium">{post.author.name}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/blog/${post.slug}`} className="flex items-center">
                    Read more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
