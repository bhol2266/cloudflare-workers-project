import { load } from "cheerio";
import Scrape_Video_Item from "./utils";


export   async function getPornstarVideos(request) {
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
      var pornstarInformation = {
        title: "",
        subscribe: "",
        views: "",
        videos: "",
        age: "",
        from: "",
        ethnicity: "",
        hairColor: "",
        height: "",
        weight: ""
      };
      var collageImages = [];
      pornstarInformation.title = $2("h1").text().trim().replace(/\n/g, " ").replace("Similar pornstarsSimilar pornstars", "").trim();
      pornstarInformation.subscribe = $2("button").text().trim().replace(/\n/g, " ").replace("Send messageResend verification link", "").trim();
      const spans = $2("div.relative.pr-6 div").find("span");
      spans.each((i, el) => {
        const text3 = $2(el).text().trim();
        if (text3.startsWith("Views:")) {
          pornstarInformation.views = text3.replace("Views: ", "");
        } else if (text3.startsWith("Videos:")) {
          pornstarInformation.videos = text3.replace("Videos: ", "");
        } else if (text3.startsWith("Age:")) {
          pornstarInformation.age = text3.replace("Age: ", "");
        } else if (text3.startsWith("From:")) {
          pornstarInformation.from = text3.replace("From: ", "");
        } else if (text3.startsWith("Ethnicity:")) {
          pornstarInformation.ethnicity = text3.replace("Ethnicity: ", "");
        } else if (text3.startsWith("Hair color:")) {
          pornstarInformation.hairColor = text3.replace("Hair color: ", "");
        } else if (text3.startsWith("Height:")) {
          pornstarInformation.height = text3.replace("Height: ", "");
        } else if (text3.startsWith("Weight:")) {
          pornstarInformation.weight = text3.replace("Weight: ", "");
        }
      });
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
        noVideos: finalDataArray.length === 0,
        pornstarInformation,
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