export function Instructions() {
  return (
    <div className="mt-4 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h3>
      <ul className="text-sm text-gray-600 space-y-2">
        <li>• Double-click on any date to add an event</li>
        <li>• Drag events between dates to reschedule them</li>
        <li>• Click the × button to delete an event</li>
        <li>• Events are automatically colored for easy identification</li>
        <li>• Only one event per day is allowed</li>
      </ul>
    </div>
  );
}
