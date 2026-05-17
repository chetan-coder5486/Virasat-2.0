import { Family } from "../models/family.model.js";
import { Story } from "../models/story.model.js";

// Post api/story/create

export const createStory = async (req, res) => {
  try {
    const { title, description, date, tags, isMilestone, circle, memoryFiles } = req.body;
    const author = req.user.userId; // Assuming req.user is set by auth middleware
    const familyId = req.params.familyId; // Assuming user's family ID is available in req.user

    if (!familyId) {
        console.log("User is not part of any family. Cannot create story.");
      return res.status(400).json({ message: "User is not part of any family" });
    }
    const family = await Family.findById(familyId);
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }
    const story = await Story.create({
      title,
      description,
      date,
      tags,
      isMilestone,
      circle,
      family: familyId,
      memoryFiles,
      author
    });
    await family.save();
    return res.status(201).json({
        success: true,
        message: "Story created successfully",
    });
  } catch (error) {
    console.log("Error creating story:", error);
    res.status(400).json({ message: error.message });
  }
};


export const getAllStoriesByFamily = async (req, res) => {
    try{
        const familyId = req.params.familyId; 
        const family = await Family.findById(familyId);
        if(!family){
            return res.status(404).json({
                success: false,
                message: "Family not found"
            })
        }
        const stories = await Story.find({ family: familyId }).populate('author', 'name avatar');
        if(!stories){
            return res.status(404).json({
                success: false, 
                message: "No stories found for this family"
            })
        }
        console.log(`Fetched ${stories.length} stories for family ${family.name}`);
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

