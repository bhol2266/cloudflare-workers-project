export async function getVideos() {
 
    return new Response(JSON.stringify({success:true}), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }