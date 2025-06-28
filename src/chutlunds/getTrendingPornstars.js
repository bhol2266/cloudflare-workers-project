import { load } from "cheerio";


export async function getTrendingPornstars(request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ message: "Only POST requests are allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const url = `https://spankbang.party/pornstars`;

    const response = await fetch(url);
    const html3 = await response.text();
    const $ = load(html3);


    const models = [];

    $('[data-testid="trending-models"]').each((i, el) => {
      const element = $(el);

      // Name
      const name = element.find('a.mt-2').text().trim();

      // Profile URL
      const profileUrl = element.find('a').first().attr('href');

      // Image URL
      let imgSrc = element.find('img').attr('data-src') || element.find('img').attr('src');
      let imageUrl = imgSrc?.startsWith('//') ? `https:${imgSrc}` : imgSrc;
      imageUrl = imageUrl.replace("spankbang.com", "spankbang.party"); // Remove size from URL if present

      // View count
      const viewsText = element.find('span.left-2').text().replace(/,/g, '').trim();
      const views = parseInt(viewsText) || 0;

      // Video count
      const videosText = element.find('span.right-2').text().replace(/,/g, '').trim();
      const videos = parseInt(videosText) || 0;

      models.push({
        name,
        profileUrl,
        imageUrl,
        views,
        videos
      });
    });
    return new Response(JSON.stringify(models), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}