import React from "react";

function SubjectSidebar({ items = [], selected, onSelect, onClear }) {
  return (
    <aside className="w-full sm:w-[300px] shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 top-[80px] overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Khóa học</h3>
        </div>

        <ul className="space-y-2">
            <li>
            <button
                onClick={onClear}
                className={[
                  "w-full text-left px-3 py-2.5 rounded-xl border transition focus:outline-none focus:ring-4 cursor-pointer",
                  selected === "ALL"
                    ? "bg-blue-50 border-blue-200 text-blue-700 focus:ring-blue-100"
                    : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 focus:ring-gray-100",
                ].join(" ")}
                title="Tất cả môn học"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm leading-snug whitespace-normal break-words">
                    Tất cả môn học
                  </span>
                </div>
              </button>
            </li>
          {items.map(({ key, label, count, disabled }) => {
            const isActive = selected === key;
            return (
              <li key={key}>
                <button
                  onClick={() => onSelect(key)}
                  disabled={disabled}
                  aria-disabled={disabled}
                  className={[
                    "w-full text-left px-3 py-2.5 rounded-xl border transition focus:outline-none focus:ring-4",
                    isActive
                      ? "bg-blue-50 border-blue-200 text-blue-700 focus:ring-blue-100"
                      : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 focus:ring-gray-100",
                    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                  ].join(" ")}
                  title={label}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* KHÔNG truncate: cho phép xuống dòng & wrap chữ dài */}
                    <span className="text-sm leading-snug whitespace-normal break-words">
                      {label}
                    </span>
                    <span
                      className={[
                        "ml-auto text-xs inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-full border bg-white",
                        isActive ? "border-blue-300 text-blue-700" : "border-gray-200 text-gray-700",
                      ].join(" ")}
                    >
                      {count}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export default SubjectSidebar;
