import React, { useEffect, useState } from 'react'

import LessonDetailCard from '../components/LessonDetailCard'

import { useParams } from 'react-router-dom'

import lessonService from '../services/lessonService'



function ManageLessonDetailPage() {
  const { lessonId } = useParams();

  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    try {
      const fetchLesson = async () => {
        const response = await lessonService.getLessonById(lessonId);
        setLesson(response.data);
      };
      fetchLesson();
    } catch (error) {
      console.error("Error fetching lesson:", error);
    }
  }, [lessonId]);


  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full'>
      {/* <h1>
        {lesson?.title}
      </h1> */}
      <LessonDetailCard lesson={lesson} />

    </div>
  )
}

export default ManageLessonDetailPage
