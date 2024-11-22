import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

async function extractAsinFromUrl(url) {
  const asinMatch = url.match(/\/([A-Z0-9]{10})(?:[/?]|$)/);
  return asinMatch ? asinMatch[1] : null;
}

async function fetchAmazonReviews(url) {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    // Convert product URL to reviews URL
    const asin = await extractAsinFromUrl(url);
    const reviewsUrl = `https://www.amazon.com/product-reviews/${asin}`;
    
    // Set viewport and user agent
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to reviews page
    await page.goto(reviewsUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for reviews container
    await page.waitForSelector('#cm_cr-review_list', { timeout: 100000000 });

    // Extract reviews
    const reviews = await page.evaluate(() => {
      const reviewElements = document.querySelectorAll('[data-hook="review"]');
      return Array.from(reviewElements).map(review => {
        // Get the rating
        const ratingElement = review.querySelector('[data-hook="review-star-rating"]');
        const rating = ratingElement ? 
          parseInt(ratingElement.textContent.split(' ')[0]) : 
          0;

        // Get review title
        const titleElement = review.querySelector('[data-hook="review-title"]');
        const title = titleElement ? 
          titleElement.textContent.replace('Reviewed in', '').trim() : 
          '';

        // Get review text
        const textElement = review.querySelector('[data-hook="review-body"]');
        const content = textElement ? 
          textElement.textContent.trim() : 
          '';

        // Get review date
        const dateElement = review.querySelector('[data-hook="review-date"]');
        const date = dateElement ? 
          dateElement.textContent.trim() : 
          '';

        // Check if verified purchase
        const verifiedElement = review.querySelector('[data-hook="avp-badge"]');
        const verified = !!verifiedElement;

        // Get helpful votes
        const helpfulElement = review.querySelector('[data-hook="helpful-vote-statement"]');
        const helpful = helpfulElement ? 
          helpfulElement.textContent.trim() : 
          '0';

        return {
          title,
          content,
          rating,
          date,
          verified,
          helpful
        };
      });
    });

    // Get total reviews count and average rating
    const metadata = await page.evaluate(() => {
      const ratingElement = document.querySelector('.averageStarRating');
      const totalElement = document.querySelector('[data-hook="total-review-count"]');
      
      return {
        averageRating: ratingElement ? 
          parseFloat(ratingElement.textContent.split(' ')[0]) : 
          0,
        totalReviews: totalElement ? 
          parseInt(totalElement.textContent.replace(/,/g, '')) : 
          0
      };
    });

    return { reviews, metadata };

  } catch (error) {
    console.error('Error scraping reviews:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    
    if (!url.includes('amazon.com')) {
      return NextResponse.json(
        { error: 'Only Amazon URLs are supported currently' }, 
        { status: 400 }
      );
    }
    
    const asin = await extractAsinFromUrl(url);
    
    if (!asin) {
      return NextResponse.json(
        { error: 'Invalid Amazon URL. Could not extract product ID.' }, 
        { status: 400 }
      );
    }

    const { reviews, metadata } = await fetchAmazonReviews(url);
    
    // Add basic sentiment analysis
    const analyzedReviews = reviews.map(review => ({
      ...review,
      analysis: {
        sentiment: calculateBasicSentiment(review.content),
        keywords: extractKeywords(review.content)
      }
    }));

    return NextResponse.json({ 
      reviews: analyzedReviews,
      metadata: {
        ...metadata,
        sentimentSummary: calculateOverallSentiment(analyzedReviews)
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews: ' + error.message }, 
      { status: 500 }
    );
  }
}

// Helper functions remain the same
function calculateBasicSentiment(text) {
  const positiveWords = ['great', 'good', 'excellent', 'amazing', 'love', 'perfect'];
  const negativeWords = ['bad', 'poor', 'terrible', 'horrible', 'hate', 'worst'];
  
  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score++;
    if (negativeWords.includes(word)) score--;
  });
  
  return {
    score,
    label: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
  };
}

function extractKeywords(text) {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 4)
    .slice(0, 5);
}

function calculateOverallSentiment(reviews) {
  const sentiments = reviews.map(review => review.analysis.sentiment.label);
  const counts = {
    positive: sentiments.filter(s => s === 'positive').length,
    neutral: sentiments.filter(s => s === 'neutral').length,
    negative: sentiments.filter(s => s === 'negative').length
  };
  
  return {
    ...counts,
    predominant: Object.entries(counts)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0]
  };
} 