import { load } from "cheerio";

import extractUrls from "extract-urls";
function scrapeListing(html) {
    const $ = load(html);


    
    /* ---------------- Listing videos ---------------- */
    const results = [];

    $("ul.responsiveListing > li").each((_, li) => {
        const el = $(li);
        const anchor = el.find("a.js-linkVideoThumb");

        const img = anchor.find("img.thumb");

        const videoId = anchor.attr("data-video-id") || null;

        if (!videoId) return;

        results.push({
            videoId: videoId,
            url: anchor.attr("href") || null,
            title: anchor.find("span.title").text().trim() || null,
            duration: anchor.find("span.duration").text().trim() || null,
            views:
                anchor
                    .find("span.hoverInfo .views")
                    .parent()
                    .text()
                    .replace(/\s+/g, " ")
                    .trim() || null,
            isHD: anchor.find("span.hd").length > 0,
            thumbnail:
                img.attr("data-original") ||
                img.attr("src") ||
                null,
            previewVideo: img.attr("data-mediabook") || null,
        });
    });

    /* ---------------- Video info section ---------------- */
    const section = $("#infoSection");

    const pageTitle =
        section.find("h1.videoTitle").text().trim() || null;

    const categories = [];
    section.find(".categories a").each((_, a) => {
        const el = $(a);
        const name = el.text().trim();
        const url = el.attr("href");

        if (name && url) {
            categories.push({
                name,
                slug: url.split("/").pop(),
                url,
            });
        }
    });

    const tags = [];
    section.find(".tags a").each((_, a) => {
        const el = $(a);
        const name = el.text().trim();
        const url = el.attr("href");

        if (name && url) {
            tags.push({
                name,
                slug: url.split("/").pop(),
                url,
            });
        }
    });

    /* ---------------- Stats ---------------- */
    const totalViews =
        Number($(".views span").text().replace(/,/g, "")) || 0;

    const likesText = $(".votesUp").text().trim();
    const likes = likesText
        ? likesText.includes("K")
            ? Math.round(parseFloat(likesText) * 1000)
            : Number(likesText.replace(/,/g, ""))
        : 0;

    /* ---------------- Final return ---------------- */
    return {
        pageTitle,
        totalViews,
        likes,
        categories,
        tags,
        videos: results,
    };
}

export async function getVideoPlayer(request) {

    //this api is used by category and seach page only

    if (request.method !== "POST") {
        return new Response(JSON.stringify({ message: "Only POST requests are allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
        });
    }



    try {
        const requestBody = await request.json();
        let url = requestBody.url;

        const response = await fetch(url);

        const html = await response.text();
        console.log(url);

        const position = html.indexOf(`videoUrl`,)
        let word = html.substring(position, position + 3000); // "Hello"


        word = word.replace(/\\\//g, "/");
        console.log(word);

        const urls = extractUrls(word) || [];
        const filteredUrls = urls.filter(u =>
            u.includes("https://ev-h-tz.phncdn.com/")
        );



        const qualityMap = {};

        filteredUrls.forEach(url => {
            const match = url.match(/\/(\d{3,4})P_/i); // matches 240P, 480P, 720P, 1080P
            if (match) {
                const quality = `${match[1]}p`;
                qualityMap[quality] = url;
            }
        });


        let results = scrapeListing(html);
        results.videoUrls = qualityMap;


        return new Response(JSON.stringify(results), {
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