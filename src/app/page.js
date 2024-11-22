'use client';

import { useState } from 'react';
import { useReviews } from '@/contexts/ReviewsContext';
import ReviewsList from '@/components/Reviews/ReviewsList';

export default function Home() {
  const [url, setUrl] = useState('');
  const { fetchReviews, loading } = useReviews();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    await fetchReviews(url);
  };

  return (
    <>
      <section className="search-container">
        <h1>Aggregate Reviews For Any Product</h1>
        <p className="text-center text-gray-400 mb-8">
          Paste a product URL to see aggregated reviews from multiple shopping sites
        </p>
        <form onSubmit={handleSubmit} className="url-input-container">
          <span className="url-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </span>
          <input 
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.amazon.com/product-url"
            className="search-input pl-12"
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-primary"
          >
            {loading ? 'Loading...' : 'Analyze'}
          </button>
        </form>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8">
        <ReviewsList />
      </section>
    </>
  );
} 