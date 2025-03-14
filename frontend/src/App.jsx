import React,{ useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import './App.css'


function App() {
  const [files, setFiles] = useState([]);
  
  const fetchData = async () => {
    try {
      const res = await axios.get('https://side-project-t4jc.vercel.app/api/upload');
      setFiles(res.data);
      
      // Store the data in localStorage for future use
      localStorage.setItem('filesData', JSON.stringify(res.data));
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Try to get data from localStorage if API call fails
      const cachedData = localStorage.getItem('filesData');
      if (cachedData) {
        setFiles(JSON.parse(cachedData));
      }
    }
  }
  const updateQuestion = async (fileId, questionId, isUploaded, newSet, newSetQuestion) => {
    try {
      const res = await axios.patch(`https://side-project-t4jc.vercel.app/api/upload/${fileId}/${questionId}`, {
        isUploaded: isUploaded,
        set: newSet,
        setQuestion: newSetQuestion
      });
      
      // Update the local state after successful API call
      setFiles(prevFiles => prevFiles.map(file => {
        if (file._id === fileId) {
          return {
            ...file,
            questions: file.questions.map(question =>
              question._id === questionId 
                ? { ...question, set: newSet, isUploaded: isUploaded, setQuestion: newSetQuestion }
                : question
            )
          };
        }
        return file;
      }));
      
      console.log('Updated successfully:', res.data);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {files.map((file) => (
        <div key={file._id} className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-4">
            File: {file.file_name}
          </h2>
          {file.questions.map((question) => (
            <Card 
              key={question._id} 
              fileId={file._id}
              data={question} 
              onUpdate={updateQuestion}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const Card = ({ fileId, data, onUpdate }) => {
  const [setValue, setSetValue] = useState(data.set || '');
  const [setQuestionValue, setSetQuestionValue] = useState(data.setQuestion || '');
  const [isUploaded, setIsUploaded] = useState(data.isUploaded);

  const handleSubmit = () => {
    setIsUploaded(!isUploaded);
    onUpdate(fileId, data._id, isUploaded, setValue, setQuestionValue);
  };

  return (
    <>
    {isUploaded && (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 my-4">
        <div className="flex justify-between items-center">
          <span className="text-blue-600 font-semibold">
            Question {data.question_number}
          </span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
            {data.topic}
          </span>
        </div>

        <div className="space-y-4">
          <p className="text-gray-800 text-lg">
            {data.question_text}
          </p>
          {data.isQuestionImage && data.question_image && (
            <img src={data.question_image} alt="Question" className="w-full max-w-md mx-auto" />
          )}

          <div className="space-y-2">
            {data.isOptionImage ? (
              <div className="grid grid-cols-2 gap-4">
                {data.option_images.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-2">
                    <img src={image} alt={`Option ${index + 1}`} className="w-full" />
                    <p className="text-center mt-2">{data.options[index]}</p>
                  </div>
                ))}
              </div>
            ) : (
              data.options.map((option, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {option}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 text-sm text-gray-600 border-t border-gray-200">
          <span>{data["Exam Name"]}</span>
          <span>Year: {data.Year}</span>
          <div className="flex items-center gap-2">
            <label htmlFor={`setQuestion-${data._id}`}>SetQuestion:</label>
            <input
              id={`setQuestion-${data._id}`}
              type="text"
              value={setQuestionValue}
              onChange={(e) => setSetQuestionValue(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-16"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor={`set-${data._id}`}>Set:</label>
            <input
              id={`set-${data._id}`}
              type="text"
              value={setValue}
              onChange={(e) => setSetValue(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-16"
            />
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Update Set
        </button>
      </div>
    )}
    </>
  );
};

Card.propTypes = {
  fileId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    question_number: PropTypes.number.isRequired,
    question_text: PropTypes.string.isRequired,
    isQuestionImage: PropTypes.bool,
    question_image: PropTypes.string,
    setQuestion: PropTypes.number,
    isOptionImage: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    option_images: PropTypes.arrayOf(PropTypes.string),
    topic: PropTypes.string.isRequired,
    "Exam Name": PropTypes.string.isRequired,
    Year: PropTypes.number.isRequired,
    set: PropTypes.number,
    isUploaded: PropTypes.bool
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default App
