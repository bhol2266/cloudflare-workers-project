import { load } from "cheerio";
import Scrape_Video_Item from "./utils";


export async function getPornstarVideos(request) {
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
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const html3 = await response.text();
    const $2 = load(html3);



    // Extract main profile details
    const name = $2("h1.text-title-sm").text().trim();
    var pornstarImage = $2('.flex.h-32.shrink-0.basis-24.items-center.xl\\:h-\\[8\\.625rem\\] img').first().attr("src");
    if (pornstarImage) {
      pornstarImage = pornstarImage.replace(/^\/\//, "https://").replace(".com", ".party");
    }

    // Extract statistics
    const videos = $2("span:contains('Videos:') em").first().text().trim();
    const views = $2("span:contains('Views:') em").first().text().trim();
    const subscribers = $2("span:contains('Subscribers:') em").first().text().trim();
 
    const firstImageSrc = $2('.flex.h-32.shrink-0.basis-24.items-center.xl\\:h-\\[8\\.625rem\\] img').first().attr("src");

    // Extract similar profiles
    const similarProfiles = [];
    $2(".relative a").each((i, el) => {
      const name = $2(el).find("p").text().trim();
      var image = $2(el).find("img").attr("src");
      const link = $2(el).attr("href");

      if (image) {
        image = image.replace(/^\/\//, "https://").replace(".com", ".party");
      }
    
      if (name && image) {
        similarProfiles.push({ name, image, link });
      }
    });

    // Extract description
    const description = $2(".relative p").text().trim();

    const pornstarData = {
      name,
      pornstarImage,
      videos,
      views,
      subscribers,
      description,
      similarProfiles
    };


    const finalDataArray = Scrape_Video_Item($2);
    let pages = [];
    $2(".paginate-bar .status").each((i, el) => {
      const data2 = $2(el).text().replace("page", "");
      pages = data2.split("/");
    });
    const pageNumbers = [];
    $2(".pagination ul li").each(function () {
      const listItem = $2(this);
      const pageText = listItem.text().trim();
      if (!listItem.hasClass("previous") && !listItem.hasClass("next") && !listItem.hasClass("disabled")) {
        pageNumbers.push(pageText);
      }
    });
    if (pages.length == 0 && pageNumbers.length >= 2) {
      pages.push(pageNumbers[0]);
      pages.push(pageNumbers[pageNumbers.length - 1]);
    }
 
    var collageImages = [];
  
    if (finalDataArray.length > 0) {
      const maxImages = Math.min(finalDataArray.length, 18);
      for (let index2 = 0; index2 < maxImages; index2++) {
        const { thumbnail } = finalDataArray[index2];
        collageImages.push(thumbnail);
      }
      while (collageImages.length < 18) {
        const randomIndex = Math.floor(Math.random() * finalDataArray.length);
        const { thumbnail } = finalDataArray[randomIndex];
        collageImages.push(thumbnail);
      }
    }
 
    const result = {
      finalDataArray,
      pages,
      collageImages,
      pornstarData

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