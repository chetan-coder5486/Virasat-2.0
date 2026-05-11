import { motion } from "framer-motion";
import { Calendar, Tag, MessageCircle, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";



const StoryCard = ({
  title,
  excerpt,
  author,
  date,
  tags,
  imageUrl,
  likes,
  comments,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-[var(--shadow-elevated)]"
    >
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{date}</span>
          <span className="text-border">•</span>
          <span>{author}</span>
        </div>
        <h3 className="mb-2 font-display text-lg font-semibold text-card-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {excerpt}
        </p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-normal"
            >
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {comments}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StoryCard;
