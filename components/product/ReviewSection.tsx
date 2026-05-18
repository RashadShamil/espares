'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

// Initial dummy reviews to populate the section
const initialReviews = [
  {
    id: 1,
    name: "Saman Perera",
    rating: 5,
    date: "2 days ago",
    comment: "Perfect fit for my Samsung WA80. Delivery was super fast, received it the next day in Kandy.",
    verified: true
  },
  {
    id: 2,
    name: "Kamal D.",
    rating: 5,
    date: "1 week ago",
    comment: "Genuine part as described. The packaging was good and safe.",
    verified: true
  },
  {
    id: 3,
    name: "Nimali F.",
    rating: 4,
    date: "2 weeks ago",
    comment: "Works well, but took 3 days to deliver to Jaffna.",
    verified: true
  }
];

export default function ReviewSection() {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a star rating");
    
    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      const newReview = {
        id: Date.now(),
        name: name || "Anonymous Customer",
        rating: rating,
        date: "Just now",
        comment: comment,
        verified: false // User submissions aren't verified immediately
      };
      
      setReviews([newReview, ...reviews]);
      setName('');
      setComment('');
      setRating(0);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" id="reviews">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h3>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* --- LEFT: Review List --- */}
        <div className="md:col-span-7 space-y-8">
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-10 w-10 text-gray-200" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <CheckBadgeIcon className="h-3 w-3 mr-1" /> Verified Purchase
                    </span>
                  )}
                </div>
                
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* --- RIGHT: Write a Review Form --- */}
        <div className="md:col-span-5">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="font-bold text-lg mb-4">Write a Review</h4>
            <form onSubmit={handleSubmit}>
              
              {/* Star Rating Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-1 cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      {star <= (hoverRating || rating) ? (
                        <StarIcon className="h-8 w-8 text-yellow-400" />
                      ) : (
                        <OutlineStarIcon className="h-8 w-8 text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all"
                  required 
                />
              </div>

              {/* Comment Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea 
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the product? Did it fit?"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition-all resize-none"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-green text-white font-bold py-3 rounded-md hover:bg-green-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}