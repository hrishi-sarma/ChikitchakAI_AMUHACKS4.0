
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Tag, ArrowLeft, Share, Bookmark, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { blogPosts } from "@/data/blogPosts";
import { BlogPost } from "@/types/blog";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Find the post with the matching slug
    const foundPost = blogPosts.find(p => p.slug === slug);
    setPost(foundPost || null);
    
    // If post is found, find related posts in the same category
    if (foundPost) {
      const related = blogPosts
        .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 3);
      setRelatedPosts(related);
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="w-full animate-fade-in text-center py-12">
        <h1 className="text-2xl font-medium mb-4">Post not found</h1>
        <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/blog" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all posts
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {/* Cover Image */}
            <div className="h-64 md:h-80 overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="outline" className="bg-medease-50 text-medease-700 dark:bg-medease-900/30 dark:text-medease-300">
                  {post.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {post.date}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  {post.author.name}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-semibold mb-6">{post.title}</h1>
              
              <div className="prose dark:prose-invert prose-medease max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <img src={post.author.avatar} alt={post.author.name} />
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button size="sm" className="bg-medease-500 hover:bg-medease-600">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>
        
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">About the Author</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar className="h-20 w-20 mb-4">
                    <img src={post.author.avatar} alt={post.author.name} />
                  </Avatar>
                  <h4 className="font-medium text-lg">{post.author.name}</h4>
                  <p className="text-sm text-muted-foreground">{post.author.role}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {post.author.bio}
                </p>
                <Button variant="outline" className="w-full">View Profile</Button>
              </CardContent>
            </Card>
            
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-medium">Related Articles</h3>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-80">
                    {relatedPosts.map((relatedPost, index) => (
                      <div key={relatedPost.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <Link to={`/blog/${relatedPost.slug}`} className="flex gap-3">
                          <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded">
                            <img src={relatedPost.coverImage} alt={relatedPost.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium line-clamp-2 text-sm">{relatedPost.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{relatedPost.date}</p>
                          </div>
                        </Link>
                        {index < relatedPosts.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">Subscribe to Newsletter</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Get the latest health tips and updates delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input 
                    placeholder="Your email address"
                    className="w-full p-2 border rounded"
                  />
                  <Button className="w-full bg-medease-500 hover:bg-medease-600">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
