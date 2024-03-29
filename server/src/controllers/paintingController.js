const router = require("express").Router()
const paintingManager = require("../managers/paintingManager")
const { isAuth, auth, isOwner } = require("../middlewares/authMiddleware")
const Painting = require("../models/Painting")
const getErrorMessage = require('../utils/errorUtils')

router.use((req, res, next) => {


    res.header('Access-Control-Allow-Origin', 'http://localhost:4200'),
        res.header('Access-Control-Allow-Methods', '*'),
        res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");



    //     res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");

    next()
})




router.get('/paintings', async (req, res) => {
    try {
        const allPaintings = await paintingManager.getAll();
        res.json(allPaintings);
    } catch (error) {
        console.error('Error fetching paintings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// router.post('/add', isAuth, async (req,res) =>{

//   const painting = req.body
//   try {
//       const newPainting = await paintingManager.create(req.user._id, painting);
//       res.json(newPainting)
//   } catch (err) {
//       // const message = getErrorMessage(err)
//       console.log(err.message)
//   }
// })

router.get('/add', isAuth, async (req, res) => {
    res.status(405).json({ error: 'GET method not allowed for this endpoint - add' });
})



router.post('/add', isAuth, async (req, res) => {
    // Extract painting data from the request body
    const paintingData = req.body;

    try {
        // Create a new painting document with the author set to the _id of the authenticated user
        const newPainting = await paintingManager.create(req.user._id, paintingData);
        res.json(newPainting);
    } catch (error) {
        console.error('Error creating painting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/paintings/:paintingId', async (req, res) => {
    const paintingId = req.params.paintingId;
    // console.log('Requested painting ID:', paintingId);
    try {
        const onePainting = await paintingManager.getOneWithDetails(paintingId);
        // console.log(onePainting);
        if (!onePainting) {
            return res.status(404).json({ message: 'Painting not found' });
        }
        return res.json(onePainting);
    } catch (error) {
        console.error('Error fetching one painting:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/paintings/:paintingId/edit", isAuth, isOwner, async (req, res) => {
    // if (!req.user) {
    //     return
    // }
    try {
        const paintingId = req.params.paintingId
        console.log('this is the painting im trying to edit', paintingId)
        const painting = await paintingManager.getOneWithDetails(paintingId)
        res.status(200).json(painting)
    } catch (err) {
        console.error('Error fetching painting:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.post('/paintings/:paintingId/edit', isAuth, isOwner, async (req, res) => {
    const paintingData = req.body;
    try {
      // Update the painting data in your database using paintingId and paintingData
      // Ensure that the author field is set to the ObjectId of the user who created the painting
      paintingData.author = req.user._id; // Assuming req.user contains the authenticated user's data
      const updatedPainting = await paintingManager.edit(req.params.paintingId, paintingData);
      console.log(updatedPainting)
      res.status(200).json(updatedPainting);
    } catch (error) {
      console.error('Error updating painting:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/paintings/:id/delete', async (req, res) => {
    try {
      const paintingId = req.params.id;
      // Check if the painting exists
      const painting = await Painting.findById(paintingId);
      if (!painting) {
        return res.status(404).json({ error: 'Painting not found' });
      }
      await Painting.findByIdAndDelete(paintingId);
      return res.status(204).send(); // No content
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  });


module.exports = router

// ISOWNER - ONLY OWNER SHOULD BE ABLE TO EDIT AND DELETE! DO THIS! + DO DELETE + profile, search!
