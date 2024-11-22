'use client';

import { useReviews } from '@/contexts/ReviewsContext';

export default function ReviewsList() {
  const { reviews, loading, error } = useReviews();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error}
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="text-gray-400 text-center py-8">
        No reviews to display. Enter a product URL above to get started.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">{review.title}</h3>
              <p className="text-gray-400 text-sm">{review.date}</p>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-white">{review.rating}/5</span>
            </div>
          </div>
          <p className="text-gray-300">{review.content}</p>
          {review.verified && (
            <span className="inline-block mt-4 text-sm text-green-400">
              Verified Purchase
            </span>
          )}
        </div>
      ))}
    </div>
  );
} 