import { load } from "cheerio";
import { Scrape_Video_Item_Channel_Creator_Pornstar } from "./utils";




export async function getTrendingChannels(request) {

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
    var trendingChannels = [];
    var newChannels = [];
    const firstUl = $2("#channels ul").first();
    firstUl.find("li a:nth-child(1)").each((index2, element) => {

      const el = $2(element); // wrap the raw DOM node
      const img = el.find('img'); // now we can use .find()
      let src = img.attr('src');
      src = src.replace(".com", ".party").replace("//", "https://www."); // get the first image if there are multiple
      const title = img.attr('title');
      trendingChannels.push({ channelName: title, imageUrl: src });
    });

    const secondUl = $2("#channels ul").eq(1);
    secondUl.find("li a:nth-child(1)").each((index2, element) => {


       const el = $2(element); // wrap the raw DOM node
      const img = el.find('img'); // now we can use .find()
      let src = img.attr('src');
      src = src.replace(".com", ".party").replace("//", "https://www."); // get the first image if there are multiple
      const title = img.attr('title');
      newChannels.push({ channelName: title, imageUrl: src });
    });
    const result = {
      finalDataArray,
      pages,
      newChannels,
      trendingChannels
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