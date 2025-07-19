import { useState } from "react";
import moment from "moment";

function App() {
  const [currentDate, setCurrentDate] = useState(moment());

  const getDaysInMonth = () => {
    const start = moment(currentDate).startOf("month").startOf("week");
    const end = moment(currentDate).endOf("month").endOf("week");
    const days = [];
    let day = start.clone();

    while (day.isSameOrBefore(end)) {
      days.push(day.clone());
      day.add(1, "day");
    }
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-t-xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
            <button
              onClick={goToToday}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousMonth}
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
                onClick={goToNextMonth}
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

          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-4 text-center font-semibold text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {getDaysInMonth().map((day, index) => {
              const isCurrentMonth = day.isSame(currentDate, "month");
              const isToday = day.isSame(moment(), "day");
              const isSelected = day.isSame(currentDate, "day");

              return (
                <div
                  key={index}
                  className={`
                    min-h-[80px] p-2 border-r border-b border-gray-200 relative
                    ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                    ${isSelected ? "bg-blue-500 text-white" : ""}
                    hover:bg-blue-50 transition-colors cursor-pointer
                  `}
                >
                  <div
                    className={`
                    text-sm font-medium
                    ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                    ${isSelected ? "text-white" : ""}
                    ${isToday && !isSelected ? "text-blue-600 font-bold" : ""}
                  `}
                  >
                    {day.format("D")}
                  </div>
                  {isToday && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
