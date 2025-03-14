const express = require('express');
const router = express.Router();
const Question = require('../model/question');

router.get('/upload', async (req, res) => {
    const data = await Question.find({});
    res.json(data);
});

router.put('/upload/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        // const { isUploaded, set, setQuestion } = req.body;
        console.log(req.body);
        const data = await Question.findOneAndUpdate(
           {_id: fileId},
           req.body,
           {new: true}
        );
        
        if (!data) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        res.json({
            message: 'Question updated successfully',
            data: data
        });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Failed to update question', details: error.message });
    }
});

router.patch('/upload/:fileId/:questionId', async (req, res) => {
    try {
        const { fileId, questionId } = req.params;
        const { isUploaded, set, setQuestion } = req.body;

        const data = await Question.findOneAndUpdate(
            { 
                _id: fileId,
                'questions._id': questionId 
            },
            { 
                $set: {
                    'questions.$.isUploaded': isUploaded,
                    'questions.$.set': set,
                    'questions.$.setQuestion': setQuestion
                }
            },
            { new: true }
        );
        
        if (!data) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        res.json({
            message: 'Question updated successfully',
            data: data
        });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Failed to update question', details: error.message });
    }
});

router.patch('/upload/bulk/set', async (req, res) => {
    try {
        const { fileId, questionIds, set } = req.body;
        
        if (!Array.isArray(questionIds) || !set || !fileId) {
            return res.status(400).json({ 
                error: 'Please provide fileId, an array of questionIds and a set number' 
            });
        }

        const result = await Question.updateOne(
            { _id: fileId },
            { 
                $set: {
                    'questions.$[elem].set': set
                }
            },
            {
                arrayFilters: [{ 'elem._id': { $in: questionIds } }],
                multi: true
            }
        );

        res.json({
            message: `Updated questions with set ${set}`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error updating questions:', error);
        res.status(500).json({ 
            error: 'Failed to update questions', 
            details: error.message 
        });
    }
});

router.post('/upload', async (req, res) => {
    console.log(req.body);
    try {
        const filesData = req.body;
        if (!Array.isArray(filesData)) {
            return res.status(400).json({ error: 'Request body must be an array of file data' });
        }

        for (const fileData of filesData) {
            if (!fileData.file_name || !Array.isArray(fileData.questions)) {
                return res.status(400).json({ error: 'Each file data must include file_name and questions array' });
            }
        }
        
        const result = await Question.insertMany(filesData);
        res.status(201).json({
            message: 'Files with questions uploaded successfully',
            data: result
        });
    } catch (error) {
        console.error('Error uploading data:', error);
        res.status(500).json({ error: 'Failed to upload data', details: error.message });
    }
});

module.exports = router;
