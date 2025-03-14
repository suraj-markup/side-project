const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    file_name: {
        type: String,
        required: true
    },
    questions: [{
        question_number: {
            type: Number,
            required: true
        },
        question_text: {
            type: String,
            required: true
        },
        isQuestionImage: {
            type: Boolean,
            default: false
        },
        question_image: {
            type: String,
            default: null
        },
        setQuestion: {
            type: Number,
            default: 1
        },
        isOptionImage: {
            type: Boolean,
            default: false
        },
        options: {
            type: [String],
            default: []
        },
        option_images: {
            type: [String],
            default: []
        },
        topic: {
            type: String,
            
        },
        "Exam Name": {
            type: String,
            
        },
        Year: {
            type: Number,
            
        },
        set: {
            type: Number,
            default: 1
        },
        isUploaded: {
            type: Boolean,
            default: true
        }
    }]
});

// Sample data based on the new schema
const sampleData = {
    file_name: "page_10.png",
    questions: [
        {
            question_number: 6,
            question_text: "What should come in place of the question mark (?) in the given series based on the English alphabetical order? FQA, HTE, JWI, LZM, ?",
            isQuestionImage: false,
            question_image: null,
            setQuestion: 1,
            isOptionImage: false,
            options: [
                "1. ODR",
                "2. NCQ",
                "3. MDP",
                "4. OEP"
            ],
            option_images: [],
            topic: "General Science",
            "Exam Name": "Unknown",
            Year: 2024,
            set: 1,
            isUploaded: true
        }
    ]
};

module.exports = mongoose.model('Question', questionSchema);
