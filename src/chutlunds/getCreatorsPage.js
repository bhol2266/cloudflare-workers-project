import { load } from "cheerio";
import Scrape_Video_Item from "./utils";

export async function getCreatorsPage(request) {

    try {
        const requestBody = await request.json();
        let url = requestBody.url;
        const response = await fetch(url);

        const html = await response.text();
        const $ = load(html);

        // Extracting creator details
        const creatorName = $('h1.text-primary').text().trim();
        var creatorImage = $('img[alt="' + creatorName + '"]').attr('src');

        if (creatorImage) {
            creatorImage = creatorImage.replace(/^\/\//, "https://").replace(".com", ".party");
        }

        const creatorHref = $(".grid.grid-cols-1.gap-2.md\\:mt-2.md\\:grid-cols-2 a").attr("href");
        

        // Extracting counts
        const videosCount = $('span:contains("Videos") em').text().trim();
        const viewsCount = $('span:contains("Views") em').text().trim();
        const subscribersCount = $('span:contains("Subscribers") em').text().trim();

        // Extracting description
        const description = $('p.text-body-md').text().trim();

        // Structuring the extracted data
        const creatorData = {
            creatorName: creatorName,
            creatorImage: creatorImage,
            creatorHref: creatorHref,
            videosCount: videosCount,
            viewsCount: viewsCount,
            subscribersCount: subscribersCount,
            description: description
        };




        let pages = [];
        $(".paginate-bar .status").each((i, el) => {
            const data2 = $(el).text().replace("page", "");
            pages = data2.split("/");
        });
        const pageNumbers = [];
        $(".pagination ul li").each(function () {
            const listItem = $(this);
            const pageText = listItem.text().trim();
            if (!listItem.hasClass("previous") && !listItem.hasClass("next") && !listItem.hasClass("disabled")) {
                pageNumbers.push(pageText);
            }
        });
        if (pages.length == 0 && pageNumbers.length >= 2) {
            pages.push(pageNumbers[0]);
            pages.push(pageNumbers[pageNumbers.length - 1]);
        }

        const finalDataArray = Scrape_Video_Item($);
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
            creatorData

        };
        console.log(result);

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