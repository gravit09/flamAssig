export function MonthNavigation({ currentDate, onPreviousMonth, onNextMonth }) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onPreviousMonth}
          className="text-white hover:text-blue-200 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-white">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={onNextMonth}
          className="text-white hover:text-blue-200 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
