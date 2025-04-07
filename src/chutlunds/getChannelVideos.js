import { load } from "cheerio";
import {Scrape_Video_Item_Channel_Creator_Pornstar} from "./utils";

export async function getChannelVideos(request) {
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
  
    const finalDataArray = Scrape_Video_Item_Channel_Creator_Pornstar($2);
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
    var channel_name =$2('h1.p-0.text-title-sm.font-bold.capitalize.text-primary').text().trim();
    var channel_subscriber = "";
    var channel_by = "";
    var channel_link = "";
    var collageImages = [];
    channel_link = $2('div.grid  a').attr("href");
  
    $2("span em").each((i, el) => {
      channel_subscriber = $2(el).text();
    });

    const linkText = $2('div.hidden.md\\:block a').attr("href").split('/').pop();
    const extracted = linkText.split('/').pop();
    channel_by = extracted.charAt(0).toUpperCase() + extracted.slice(1);


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
      channel_name,
      channel_subscriber,
      channel_by,
      channel_link,
      collageImages
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