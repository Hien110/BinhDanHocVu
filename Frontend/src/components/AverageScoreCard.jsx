export default function AverageScoreCard({ quizResults }) {
  console.log(quizResults);
  
  if (!quizResults || quizResults.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 text-center mt-3">
        <p className="text-gray-500">Chưa có dữ liệu</p>
      </div>
    );
  }

  // Tính điểm trung bình
  const totalScore = quizResults.reduce((sum, item) => sum + (item.score || 0), 0);
  const averageScore = totalScore / quizResults.length;
  const percent = (averageScore / 10) * 100;

    // Xác định màu theo điểm
  const getProgressColor = () => {
    if (averageScore < 4) return "bg-red-400";
    if (averageScore < 8) return "bg-orange-400";
    return "bg-green-400";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 mt-3">
      <h3 className="text-lg font-bold text-gray-900">Điểm trung bình</h3>
      <p className="text-sm text-gray-500">
        Tổng hợp từ tất cả các bài kiểm tra
      </p>

      <div className="mt-4 text-3xl font-bold text-gray-900">
        {averageScore.toFixed(1)}
        <span className="text-lg text-gray-500">/10</span>
      </div>

      {/* Thanh progress */}
      <div className="mt-3 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`${getProgressColor()} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
