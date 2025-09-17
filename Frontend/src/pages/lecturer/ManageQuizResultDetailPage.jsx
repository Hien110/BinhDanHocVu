import React, { useEffect, useState } from 'react'
import quizResultService from '../../services/quizResultService'
import QuizHistoryItemByCourse from "../../components/QuizHistoryItemByCourse"
import { useParams } from 'react-router-dom'

function ManageQuizResultDetailPage() {
  const { quizId } = useParams()
  const [quizResult, setQuizResult] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('') // '' | 'score-desc' | 'score-asc'

  useEffect(() => {
    const fetchQuizResult = async () => {
      const result = await quizResultService.getQuizResultsByQuizId(quizId)
      if (result.success) {
        setQuizResult(result.data.reverse())
      }
    }
    fetchQuizResult()
  }, [quizId])

  // lọc theo tên học viên
  const filtered = quizResult.filter(item =>
    item?.student?.fullName?.toLowerCase().includes(search.toLowerCase())
  )

  // sắp xếp theo điểm
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'score-desc') {
      return b?.score - a?.score
    } else if (sortBy === 'score-asc') {
      return a?.score - b?.score
    }
    return 0
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b border-gray-200 pb-2">
        {quizResult[0]?.course?.title || "Khóa học không tồn tại"}
      </h1>

      <h2 className="text-2xl font-semibold text-custom-blue mb-6 border-b border-gray-300 pb-2">
        Danh sách kết quả bài kiểm tra
      </h2>

      <div className="mb-4 text-custom-blue">
        <span className="font-bold">Tổng số bài làm:</span> {quizResult.length}{" "} bài làm
      </div>

      {/* Thanh tìm kiếm & chọn sắp xếp */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between">
        <input
          type="text"
          placeholder="Tìm theo tên học viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-120 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-56 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">-- Sắp xếp --</option>
          <option value="score-desc">Điểm: Cao → Thấp</option>
          <option value="score-asc">Điểm: Thấp → Cao</option>
        </select>
      </div>

      {sorted.length !== 0 ? (
        <div>
          {sorted.map(item => (
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
