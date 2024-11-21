export default function Home() {
  return (
    <>
      {/* Hero Section with URL Input */}
      <section className="search-container">
        <h1>Aggregate Reviews For Any Product</h1>
        <p className="text-center text-gray-400 mb-8">
          Paste a product URL to see aggregated reviews from multiple shopping sites
        </p>
        <div className="url-input-container">
          <span className="url-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </span>
          <input 
            type="url"
            placeholder="https://www.amazon.com/product-url or any shopping site URL"
            className="search-input pl-12"
          />
        </div>
      </section>

      {/* Quick Features */}
      <div className="flex justify-center gap-4 mb-16">
        <button className="feature-pill">Price History</button>
        <button className="feature-pill">Review Analysis</button>
        <button className="feature-pill">Compare Prices</button>
        <button className="feature-pill">Authenticity Check</button>
      </div>

      {/* Recent Reviews Section */}
      <section className="trending-section">
        <h2>Recently Analyzed Products</h2>
        <div className="review-grid">
          {/* Review Cards */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="review-card">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={`/images/product${item}.jpg`} 
                    alt="Product thumbnail"
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-md font-medium">Sony WH-1000XM4</h3>
                    <p className="text-gray-400 text-sm">Wireless Headphones</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Overall Rating</span>
                    <span className="text-green-400">4.6/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Reviews</span>
                    <span>2,453</span>
                  </div>
                </div>
              </div>
              <div className="review-stats">
                <span className="text-blue-400">View Analysis →</span>
                <span className="text-gray-400">Updated 2h ago</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
} 