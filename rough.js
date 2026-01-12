import { load } from "cheerio";
import fs from "fs";
import extractUrls from "extract-urls";



function scrapeListing(html) {
    const $ = load(html);
    const results = [];

    $("ul.responsiveListing > li").each((_, li) => {
        const el = $(li);

        const anchor = el.find("a.js-linkVideoThumb");

        const videoId = anchor.attr("data-video-id") || null;
        const url = anchor.attr("href") || null;

        const img = anchor.find("img.thumb");

        const thumbnail =
            img.attr("data-original") ||
            img.attr("src") ||
            null;

        const previewVideo =
            img.attr("data-mediabook") || null;

        const title =
            anchor.find("span.title").text().trim() || null;

        const duration =
            anchor.find("span.duration").text().trim() || null;

        const views =
            anchor.find("span.hoverInfo .views")
                .parent()
                .text()
                .replace(/\s+/g, " ")
                .trim() || null;

        const isHD =
            anchor.find("span.hd").length > 0;

        results.push({
            videoId,
            url,
            title,
            duration,
            views,
            isHD,
            thumbnail,
            previewVideo,
        });
    });

    return results;
}

function scrapeVideoInfo(html) {
    const $ = load(html);

    const section = $("#infoSection");

    const title = section
        .find("h1.videoTitle")
        .text()
        .trim() || null;

    const categories = [];
    section.find(".categories a").each((_, a) => {
        const el = $(a);
        const name = el.text().trim();
        const url = el.attr("href");

        if (name && url) {
            categories.push({
                name,
                slug: url.split("/").pop(),
                url
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
                url
            });
        }
    });

    return {
        title,
        categories,
        tags
    };
}

function scrapeViewsAndLikes(html) {
  const $ = load(html);

  // Views
  const views = Number(
    $(".views span").text().replace(/,/g, "")
  ) || 0;

  // Likes (handles K format)
  const likesText = $(".votesUp").text().trim();
  const likes = likesText.includes("K")
    ? Math.round(parseFloat(likesText) * 1000)
    : Number(likesText.replace(/,/g, ""));

  return { views, likes };
}

async function testScrape() {
    try {
        const url =
            "https://www.thumbzilla.com/video/6709a14defd71/pov-colombian-big-ass-scarlet-benz-lets-airbnb-host-fill-her-pussy-with-cum-creampie";

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                Referer: "https://www.google.com/",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
            },
        });

        const html = await response.text();

        // Save raw HTML to file
        fs.writeFileSync("thumbzilla_page.html", html, "utf-8");

        console.log("HTML saved to thumbzilla_page.html");


        const $ = load(html);


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

        
        const results = scrapeListing(html);
        const videoInfo = scrapeVideoInfo(html);
        const viewsAndLikes = scrapeViewsAndLikes(html);
        console.log(viewsAndLikes);
    } catch (error) {
        console.error("Scraping error:", error);
    }
}

// Run test
testScrape();
