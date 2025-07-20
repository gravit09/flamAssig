import moment from "moment";

export function SearchResults({ searchResults, onDeleteEvent, onEditEvent }) {
  if (!searchResults || searchResults.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900">
          Search Results ({searchResults.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {searchResults.map((event) => (
          <div
            key={event.id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: event.color }}
                ></div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {event.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {moment(event.date).format("MMMM D, YYYY")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditEvent(event.id, event.name)}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-150"
                  title="Edit event"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDeleteEvent(event.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-150"
                  title="Delete event"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
