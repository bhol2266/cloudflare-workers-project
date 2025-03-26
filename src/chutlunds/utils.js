export default function Scrape_Video_Item($2) {


  const finalDataArray = [];
  $2(".js-video-item").each((i, el) => {


    const thumbnail = $2(el).find("picture img").attr("data-src");
    const title = $2(el).find("picture img").attr("alt");
    const duration = $2(el).find('.absolute.right-2.top-2.rounded.bg-neutral-900\\/75.px-1.text-body-sm.text-primary').text().trim();
    const views = $2(el).find('span[data-testid="views"]').find('span').last().text().trim();
    const likePercentage = $2(el).find('span[data-testid="rates"]').find('span').last().text().trim();
    const channelName = $2(el).find('a[data-testid="title"] span').text().trim();
    const channelHref = $2(el).find('a[data-testid="title"]').attr('href') || '';
    const videoBadge = $2(el).find('div.absolute.left-2.top-2').text().trim();
    const previewVideo = $2(el).find('video source').attr('data-src');
    const href = `https://spankbang.com${$2(el).find("a").attr("href")}`;
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


if (finalDataArray.length == 0) {
    $2(".main_results .video-item").each((i, el) => {
        const thumbnail = $2(el).find("picture img").attr("data-src");
        const title = $2(el).find("picture img").attr("alt");
        const duration = $2(el).find(".l").text();
        const views = $2(el).find('span[data-testid="views"]').find('span').last().text().trim();
        const likePercentage = $2(el).find('span[data-testid="rates"]').find('span').last().text().trim();
        const channelName = $2(el).find('a[data-testid="title"] span').text().trim();
        const channelHref = $2(el).find('a[data-testid="title"]').attr('href') || '';
        const videoBadge = $2(el).find(".video-badge.h").text().trim();
        const previewVideo = $2(el).find("picture img").attr("data-preview");
        const href = `https://spankbang.com${$2(el).find("a").attr("href")}`;

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
}
if (finalDataArray.length == 0) {
    $2(".video-item").each((i, el) => {
        const thumbnail = $2(el).find("picture img").attr("data-src");
        const title = $2(el).find("picture img").attr("alt");
        const duration = $2(el).find(".l").text();
        const views = $2(el).find('span[data-testid="views"]').find('span').last().text().trim();
        const likePercentage = $2(el).find('span[data-testid="rates"]').find('span').last().text().trim();
        const channelName = $2(el).find('a[data-testid="title"] span').text().trim();
        const channelHref = $2(el).find('a[data-testid="title"]').attr('href') || '';
        const videoBadge = $2(el).find(".video-badge.h").text().trim();
        const previewVideo = $2(el).find("picture img").attr("data-preview");
        const href = `https://spankbang.com${$2(el).find("a").attr("href")}`;

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
}


  return finalDataArray;
}