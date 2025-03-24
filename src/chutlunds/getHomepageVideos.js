export async function getHomepageVideos() {
    const homepageVideos = {
      trending: [
        {
          id: 1,
          title: 'Trending Video 1',
          duration: '12:00',
          views: 5000,
          thumbnail: 'https://example.com/trending1.jpg',
          category: 'trending'
        },
        {
          id: 2,
          title: 'Trending Video 2',
          duration: '08:30',
          views: 3500,
          thumbnail: 'https://example.com/trending2.jpg',
          category: 'trending'
        }
      ],
      newest: [
        {
          id: 3,
          title: 'New Video 1',
          duration: '15:20',
          views: 1200,
          thumbnail: 'https://example.com/new1.jpg',
          category: 'newest'
        },
        {
          id: 4,
          title: 'New Video 2',
          duration: '07:45',
          views: 800,
          thumbnail: 'https://example.com/new2.jpg',
          category: 'newest'
        }
      ]
    };
    return new Response(JSON.stringify(homepageVideos), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }