import React, { useEffect, useState } from 'react'

import quizResultService from '../services/quizResultService'

import QuizHistoryItemByCourse from "../components/QuizHistoryItemByCourse";

import { useParams } from 'react-router-dom'

function ManageQuizResultDetailPage() {

  const { quizId } = useParams();
  console.log(quizId);

  const [quizResult, setQuizResult] = useState([])

  useEffect(() => {
    const fetchQuizResult = async () => {
      const result = await quizResultService.getQuizResultsByQuizId(quizId)
      if (result.success) {
        setQuizResult(result.data)
        console.log(result.data);
        
      }
    }

    fetchQuizResult()
  }, [quizId])

  return (
    <div>
       <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
         Kết quả bài kiểm tra
      </h1>
      <div className="mb-4 text-red-400">
        <span className="font-bold">Tổng số bài làm:</span> {quizResult.length}{" "}
        bài làm
      </div>
      {quizResult.length != 0 ? (
        <div>
          {quizResult.map(item => (
            <QuizHistoryItemByCourse key={item._id} history={item} />
          ))}
        </div>
      ) : (
        <p>Không có kết quả nào cho bài kiểm tra này.</p>
      )}
    </div>
  )
}

export default ManageQuizResultDetailPage
