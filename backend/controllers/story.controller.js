import { Story } from "../models/story.model.js";

// Post api/story/create

export const createStory = async (req, res) => {
  try {
    const { title, description, date, tags, isMilestone, memoryFiles } = req.body;
    const author = req.user.userId; // Assuming req.user is set by auth middleware
    
    const story = Story.create({
      title,
      description,
      date,
      tags,
      isMilestone,
      memoryFiles,
      author
    });

    return res.status(201).json({
        success: true,
        message: "Story created successfully",
    });
  } catch (error) {
    console.log("Error creating story:", error);
    res.status(400).json({ message: error.message });
  }
};


export const getAllStories = async (req, res) => {
    try{
        const stories = await Story.find().populate('author', 'name email');
        if(!stories){
            return res.status(404).json({
                success: false,
                message: "No stories found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Stories retrieved successfully",
            data: stories
        })
    }catch(error){
        console.log("Error fetching stories:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching stories" 
        });
    }
}