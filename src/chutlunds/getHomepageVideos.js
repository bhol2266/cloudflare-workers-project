import { load } from "cheerio";


export async function getHomePageVideos(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Only POST reqs are allowed" }), {
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

    const requestBody = await req.json();

    let href = requestBody.href;

    console.log('====================================');
    console.log(requestBody.href);
    console.log('====================================');

    const response = await fetch(href);
    const body = await response.text();
    const $ = load(body);

    let finalDataArray = []

    $(".js-video-item").each((i, el) => {


      const thumbnail = $(el).find("picture img").attr("data-src");
      const title = $(el).find("picture img").attr("alt");
      const duration = $(el).find('.absolute.right-2.top-2.rounded.bg-neutral-900\\/75.px-1.text-body-sm.text-primary').text().trim();
      const views = $(el).find('span[data-testid="views"]').find('span').last().text().trim();
      const likePercentage = $(el).find('span[data-testid="rates"]').find('span').last().text().trim();
      const channelName = $(el).find('a[data-testid="title"] span').text().trim();
      const channelHref = $(el).find('a[data-testid="title"]').attr('href') || '';
      const videoBadge = $(el).find('div.absolute.left-2.top-2').text().trim();
      const previewVideo = $(el).find('video source').attr('data-src');
      const href = `https://spankbang.com${$(el).find("a").attr("href")}`;
      var refrenceLinkType = ''
      if (channelHref.includes("/channel/")) refrenceLinkType = "channel"
      if (channelHref.includes("/s/")) refrenceLinkType = "search"
      if (channelHref.includes("/creator/")) refrenceLinkType = "creator"
      if (channelHref.includes("/pornstar/")) refrenceLinkType = "pornstar"


      if (href !== void 0 && previewVideo !== void 0 && !thumbnail.includes("//assets.sb-cd.com")) {
        finalDataArray.push({
          thumbnail,
          title,
          duration,
          views,
          likePercentage,
          channelName,
          channelHref,
          refrenceLinkType,
          videoBadge,
          previewVideo,
          href
        });
      }
    });

    // finalDataArray_Array.push({ videosGroupName: "Recommended", finalDataArray });




    $(".sub_channels .channels a").each((i, el) => {
      const channelName = $(el).text().trim();
      const Href = $(el).attr("href").trim();
      let imageUrl = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
      trendingChannelArray.push({ channelName, href: Href, imageUrl: imageUrl.replace("//spankbang.com", " https://spankbang.party") });
    });
    $(".tag_head a").each((i, el) => {
      const tag = $(el).text().trim();
      const tagHref = $(el).attr("href").trim();
      tagsArray.push({ tag, href: tagHref });
    });
    $(".sub_pornstars .pornstars a").each((i, el) => {
      const pornstarName = $(el).text().trim();
      const Href = $(el).attr("href").trim();
      let imageUrl = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");
      trendingPornstarsArray.push({ pornstarName, href: Href, imageUrl: imageUrl.replace(".com", ".party") });
    });






    const homepageVideos = [{ URL: "https://spankbang.party/trending_videos/", videosGroupName: "Trending" },
    { URL: "https://spankbang.party/upcoming/", videosGroupName: "Upcoming" },
    { URL: "https://spankbang.party/most_popular/?period=week", videosGroupName: "Popular" },
    { URL: "https://spankbang.party/new_videos/", videosGroupName: "New videos" },
    { URL: "https://spankbang.party/new_videos/", videosGroupName: "Random" }]

    // for (let index = 0; index < homepageVideos.length; index++) {
    //   const OBJ = homepageVideos[index];
    //   const finalDataArray = await scrape(OBJ.URL);
    //   finalDataArray_Array.push({ videosGroupName: OBJ.videosGroupName, finalDataArray });

    // }



    const result = {
      finalDataArray,
      trendingChannels: trendingChannelArray,
      tags: tagsArray,
      trendingPornstars: trendingPornstarsArray
    };


    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing req:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

