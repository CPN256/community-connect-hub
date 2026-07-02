import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, Plus, MessageSquare, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const CATEGORIES = ["General", "Safety Tips", "Health Advice", "Career"];

const ForumPage = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "General" });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["forum-posts", category],
    queryFn: async () => {
      let q = supabase.from("forum_posts").select("*").order("created_at", { ascending: false });
      if (category !== "All") q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const createPost = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("forum_posts").insert({ ...form, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["forum-posts"] });
      toast({ title: "Post created", description: "+10 points earned!" });
      setForm({ title: "", content: "", category: "General" });
      setOpen(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const vote = useMutation({
    mutationFn: async ({ postId, value }: { postId: string; value: 1 | -1 }) => {
      if (!user) throw new Error("Sign in to vote");
      await supabase.from("forum_votes").upsert({ post_id: postId, user_id: user.id, value }, { onConflict: "post_id,user_id" });
      const post = posts.find((p: any) => p.id === postId);
      if (post) {
        await supabase.from("forum_posts").update({
          upvotes: value === 1 ? post.upvotes + 1 : post.upvotes,
          downvotes: value === -1 ? post.downvotes + 1 : post.downvotes,
        }).eq("id", postId);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["forum-posts"] }),
    onError: (e: any) => toast({ title: "Vote failed", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold">Community Forum</h1>
            <p className="text-muted-foreground mt-1">Share safety tips, ask questions, help others.</p>
          </div>
          {user ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-1" /> New Post</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create a post</DialogTitle></DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); createPost.mutate(); }} className="space-y-3">
                  <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <Textarea placeholder="What's on your mind?" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={5} />
                  <Button type="submit" className="w-full" disabled={createPost.isPending}>
                    {createPost.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Post
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <Link to="/auth"><Button variant="outline">Sign in to post</Button></Link>
          )}
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {["All", ...CATEGORIES].map((c) => (
            <Button key={c} size="sm" variant={category === c ? "default" : "outline"} onClick={() => setCategory(c)}>{c}</Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No posts yet. Be the first!</p>
        ) : (
          <div className="space-y-3">
            {posts.map((p: any) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => vote.mutate({ postId: p.id, value: 1 })}><ArrowUp className="h-4 w-4" /></Button>
                    <span className="text-sm font-semibold">{p.upvotes - p.downvotes}</span>
                    <Button size="icon" variant="ghost" onClick={() => vote.mutate({ postId: p.id, value: -1 })}><ArrowDown className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{p.category}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-heading font-semibold">{p.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.content}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" /> Comments
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ForumPage;
