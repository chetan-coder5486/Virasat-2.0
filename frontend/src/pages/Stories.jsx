import Navbar from "@/components/Navbar.jsx";
import StoryCard from "@/components/StoryCard.jsx";
import { motion } from "framer-motion";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stories = [
  {
    title: "Grandma's Apple Pie Recipe",
    excerpt: "Every Thanksgiving, the house would fill with the warm scent of cinnamon and baked apples...",
    author: "Sarah M.", date: "Nov 1965", tags: ["recipe", "tradition"], likes: 12, comments: 5,
    imageUrl: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=600&h=400&fit=crop",
  },
  {
    title: "The Summer of '78",
    excerpt: "That summer we drove all the way to the coast in Dad's old station wagon...",
    author: "Michael T.", date: "Jul 1978", tags: ["road trip", "summer"], likes: 24, comments: 8,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
  },
  {
    title: "Wedding Day Surprises",
    excerpt: "Mom and Dad's wedding was supposed to be a small affair...",
    author: "Jenny K.", date: "Jun 1982", tags: ["wedding", "family"], likes: 31, comments: 14,
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
  },
  {
    title: "Letters from the War",
    excerpt: "We found a box of letters in the attic — handwritten notes from Grandpa James...",
    author: "David R.", date: "1943", tags: ["history", "letters"], likes: 45, comments: 19,
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop",
  },
  {
    title: "First Day of School",
    excerpt: "The photo shows Mom standing in front of our old house, backpack nearly bigger than she was...",
    author: "Lisa P.", date: "Sep 1970", tags: ["childhood", "school"], likes: 18, comments: 7,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  },
  {
    title: "The Family Garden",
    excerpt: "Great-grandpa started planting roses in 1932. Three generations later, the garden still blooms...",
    author: "Anna W.", date: "1932", tags: ["garden", "heritage"], likes: 27, comments: 11,
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
  },
];

const allTags = ["recipe", "tradition", "road trip", "summer", "wedding", "family", "history", "letters", "childhood", "school", "garden", "heritage"];

const Stories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12 px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="mb-2 font-display text-4xl font-bold text-foreground">All Stories</h1>
          <p className="mb-6 text-muted-foreground">Browse and search through your family's memories</p>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search stories..." className="pl-10" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="icon"><Grid3X3 className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><List className="h-4 w-4" /></Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-secondary">{tag}</Badge>
            ))}
          </div>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, i) => (
            <StoryCard key={story.title} {...story} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stories;
