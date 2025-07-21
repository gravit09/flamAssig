import { useState, useEffect } from "react";
import moment from "moment";

export function RecurringEventModal({
  isOpen,
  onClose,
  onSubmit,
  eventName = "",
  targetDate,
}) {
  const [name, setName] = useState(eventName);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [interval, setInterval] = useState(1);

  useEffect(() => {
    setName(eventName);
    if (targetDate) {
      setStartDate(targetDate.format("YYYY-MM-DD"));
      setEndDate(targetDate.clone().add(1, "month").format("YYYY-MM-DD"));
    }
  }, [eventName, targetDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);

      if (start.isAfter(end)) {
        alert("Start date cannot be after end date");
        return;
      }

      onSubmit({
        name: name.trim(),
        startDate: startDate,
        endDate: endDate,
        frequency,
        interval: parseInt(interval),
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setName(eventName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-sm mx-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Create Recurring Event
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event name..."
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="frequency"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="interval"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Repeat Every
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                id="interval"
                min="1"
                max="99"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-600">
                {frequency === "daily" && "day(s)"}
                {frequency === "weekly" && "week(s)"}
                {frequency === "monthly" && "month(s)"}
                {frequency === "yearly" && "year(s)"}
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !startDate || !endDate}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Create Recurring Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
