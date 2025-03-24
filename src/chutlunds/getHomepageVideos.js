import { load } from "cheerio";
import Scrape_Video_Item from "./utils";


export async function getHomePageVideos(request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ message: "Only POST requests are allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }
  let finalDataArray_Array = [];
  let trendingChannelArray = [];
  let tagsArray = [];
  let trendingCategoryArray = [];
  let trendingPornstarsArray = [];
  try {
    const requestBody = await request.json();
    let href = requestBody.href;
    const response = await fetch(href);
    const body = await response.text();
    const $2 = load(body);
    $2(".video-rotate").each((i, ele) => {
      const select2 = load(ele);
      let finalDataArray = [];
      select2(".video-item").each((i2, el) => {
        const thumbnail = select2(el).find("picture img").attr("data-src");
        const title = select2(el).find("picture img").attr("alt");
        const duration = select2(el).find(".l").text();
        const views = select2(el).find(".stats .v").text().trim();
        const likePercentage = select2(el).find(".stats .r").text().trim();
        const uploadedTime = select2(el).find(".stats .d").text().trim();
        const videoBadge = select2(el).find(".video-badge.h").text().trim();
        const previewVideo = select2(el).find("picture img").attr("data-preview");
        const href2 = `https://spankbang.com${$2(el).find("a").attr("href")}`;
        if (href2 !== void 0 && previewVideo !== void 0 && !thumbnail.includes("//assets.sb-cd.com")) {
          finalDataArray.push({
            thumbnail,
            title,
            duration,
            views,
            likePercentage,
            uploadedTime,
            videoBadge,
            previewVideo,
            href: href2
          });
        }
      });
      if (finalDataArray.length > 2) {
        let videosGroupName = "";
        if (finalDataArray_Array.length == 0)
          videosGroupName = "Trending";
        if (finalDataArray_Array.length == 1)
          videosGroupName = "Upcoming";
        if (finalDataArray_Array.length == 2)
          videosGroupName = "Featured";
        if (finalDataArray_Array.length == 3)
          videosGroupName = "Popular";
        if (finalDataArray_Array.length == 4)
          videosGroupName = "New videos";
        if (finalDataArray_Array.length == 5)
          videosGroupName = "Random";
        finalDataArray_Array.push({ videosGroupName, finalDataArray });
      }
    });
    $2(".sub_channels .channels a").each((i, el) => {
      const channelName = $2(el).text().trim();
      const Href = $2(el).attr("href").trim();
      let imageUrl = $2(el).find("img").attr("data-src") || $2(el).find("img").attr("src");
      trendingChannelArray.push({ channelName, href: Href, imageUrl: imageUrl.replace("//spankbang.com", " https://spankbang.party") });
    });
    $2(".tag_head a").each((i, el) => {
      const tag = $2(el).text().trim();
      const tagHref = $2(el).attr("href").trim();
      tagsArray.push({ tag, href: tagHref });
    });
    $2(".sub_pornstars .pornstars a").each((i, el) => {
      const pornstarName = $2(el).text().trim();
      const Href = $2(el).attr("href").trim();
      let imageUrl = $2(el).find("img").attr("data-src") || $2(el).find("img").attr("src");
      trendingPornstarsArray.push({ pornstarName, href: Href, imageUrl: imageUrl.replace(".com", ".party") });
    });
    $2(".trending_categories a").each((i, el) => {
      const categoryName = $2(el).text().trim();
      const Href = $2(el).attr("href").trim();
      trendingCategoryArray.push({ categoryName, href: Href });
    });
    const result = {
      finalDataArray_Array,
      trendingChannels: trendingChannelArray,
      tags: tagsArray,
      trendingCategories: trendingCategoryArray,
      trendingPornstars: trendingPornstarsArray
    };
    return new Response(JSON.stringify({ success: true, result }), {
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