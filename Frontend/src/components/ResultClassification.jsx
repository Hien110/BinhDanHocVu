export default function ResultClassification({ quizResults }) {
  if (!quizResults || quizResults.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 text-center mt-2">
        <p className="text-gray-500">Chưa có dữ liệu</p>
      </div>
    );
  }

  // Đếm từng loại
  const weak = quizResults.filter((item) => item.score < 4).length;
  const average = quizResults.filter(
    (item) => item.score >= 4 && item.score < 8
  ).length;
  const good = quizResults.filter((item) => item.score >= 8).length;

  const categories = [
    { label: "Giỏi (≥ 8)", value: good },
    { label: "Trung bình (4 - 7.9)", value: average },
    { label: "Yếu (< 4)", value: weak },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 mt-3">
      <h3 className="text-lg font-bold text-gray-900">Phân loại kết quả</h3>
      <p className="text-sm text-gray-500 mb-4">
        Thống kê số lượng bài kiểm tra theo từng loại
      </p>

      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 text-center"
          >
            <p className="text-sm text-gray-500">{cat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{cat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
