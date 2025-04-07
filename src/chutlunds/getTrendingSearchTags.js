import { load } from "cheerio";

export async function getTrendingSearchTags(request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ message: "Only POST requests are allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const requestBody = await request.json();
    let url = requestBody.url;
    if (url.includes("https://spankbang.com/")) {
      url = url.replace("https://spankbang.com/", "https://spankbang.party/");
    }
    const response = await fetch(url);
    const html3 = await response.text();
    const $2 = load(html3);
    var tags = [];
    $2(".list li a").each((i, el) => {
      const data2 = $2(el).text();
      tags.push(data2);
    });
    const result = {
      tags
    };
    return new Response(JSON.stringify(result), {
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