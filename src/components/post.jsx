import React, { useState, useEffect } from 'react';

const DonationBlog = () => {
  const [donationData, setDonationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/donation-sections');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort by date descending (newest first)
        const sortedData = data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setDonationData(sortedData);
      } catch (error) {
        console.error('Error fetching donation data:', error);
        setError('Failed to load donation data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonationData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12  mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!donationData || donationData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No blog posts available yet.</p>
          <p className="text-gray-500 mt-2">Check back later for updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white ">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Blog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stories and updates from our community impact initiatives
            </p>
          </div>
        </div>
      </header>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {donationData.map((post, index) => {
            const activeImage = post.images.find(img => img.isActive) || post.images[0];
            
            return (
              <article 
                key={post._id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Featured Image */}
                <div className="relative h-48 bg-gray-100">
                  {activeImage ? (
                    <img 
                      src={activeImage.url} 
                      alt={activeImage.alt || "Donation cause"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.header || "Healthcare, food for marginalized children"}
                  </h3>

                  {/* Meta Information */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.paragraph}
                  </p>

                  {/* View Full Post Button */}
                  <button 
                    onClick={() => openModal(post)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium uppercase tracking-wide transition-colors duration-200"
                  >
                    View Full Post
                  </button>
                </div>
              </article>
            );
          })}
        </div>

       
      </main>

      {/* Modal */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedPost.header || "Healthcare, food for marginalized children"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Featured Image */}
              {(() => {
                const activeImage = selectedPost.images.find(img => img.isActive) || selectedPost.images[0];
                return activeImage ? (
                  <img 
                    src={activeImage.url} 
                    alt={activeImage.alt || "Donation cause"}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                ) : null;
              })()}

              {/* Date */}
              <div className="text-sm text-gray-500 mb-4">
                <time dateTime={selectedPost.createdAt}>
                  {new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>

              {/* Full Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedPost.paragraph || 'No content available for this post.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationBlog;