const express = require("express");
const Candidate = require("../models/candidate");
const { jwtAuthMiddleware } = require("../jwt");
const User = require("../models/user");

const router = express.Router();

// POST route to add a candidate

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);

    if(user.role === "admin"){
        return true;
    }
  } catch (error) {
    return false;
  }
};

router.post('/',jwtAuthMiddleware,  async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user has not admin role" });
    }
    const data = req.body;

    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();

    console.log("Candidate data Saved");

    res.status(200).json({ response: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid server error" });
  }
});

router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!await checkAdminRole(req.user.id)) {
        return res.status(403).json({ message: "user has not admin role" });
      }
    const candidateId = req.params.candidateId;
    const updateCandidate = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updateCandidate,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("candidate data updated")
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid server error" });
  }
});

router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!await checkAdminRole(req.user.id)) {
        return res.status(403).json({ message: "user has not admin role" });
      }
    const candidateId = req.params.candidateId;
    const response = await Candidate.findByIdAndDelete(candidateId);
    if (!response) {
        return res.status(404).json({ error: "Candidate not delete" });
      }

      console.log("candidate deleted")
  
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Invalid server error" });
    }
});


router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res)=>{

  candidateID = req.params.candidateID;
  userID = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateID);
    if(!candidate){
      return res.status(404).json({message: "candidate not found"})
    }
    const user = await User.findById(userID);
    if(!user){
      return res.status(404).json({message: "user not found"})
    }

    if(user.isVoted){
      return res.status(400).json({message: "user aleardy voted"})
    }
    if(user.role == "admin"){
      return res.status(403).json({message: "admin not allowed to vote"})
    }

    candidate.votes.push({user: userID})
    candidate.voteCount++
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({message: "vote recorded successfully"})

  } catch (error) {
   console.log(error)
   res.status(500).json({error : "Internal server error"}) 
  }
})

router.get('/vote/count', async (req, res)=>{
  try {
    
    const candidate = await Candidate.find().sort({voteCount: 'desc'})

    const voteRecord = candidate.map((data)=>{
      return {
        name: data.name,
        party: data.party,
        count: data.voteCount
      }
    })
    res.status(200).json(voteRecord)
  } catch (error) {
    console.log(error)
    res.status(500).json({error : "Internal server error"}) 
   }
})
module.exports = router;
