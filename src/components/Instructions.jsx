export function Instructions() {
  return (
    <div className="mt-4 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h3>
      <ul className="text-sm text-gray-600 space-y-2">
        <li>• Double-click on any date to add a regular event</li>
        <li>• Right-click on any date to add a recurring event</li>
        <li>• Drag events between dates to reschedule them</li>
        <li>• Click the × button to delete an event</li>
        <li>• Only one event per day is allowed</li>
        <li>
          • Recurring events support daily, weekly, monthly, and yearly
          frequencies
        </li>
      </ul>
    </div>
  );
}
