export function CalendarHeader({ onGoToToday }) {
  return (
    <div className="bg-white rounded-t-xl shadow-lg p-6 mb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
        <button
          onClick={onGoToToday}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Today
        </button>
      </div>
    </div>
  );
}
