async function scrape(href) {

  const response = await fetch(href);
  const body = await response.text();
  const $$ = load(body);

  let finalDataArray = []

  $$(".js-video-item").each((i, el) => {

    const thumbnail = $$(el).find("picture img").attr("data-src");
    const title = $$(el).find("picture img").attr("alt");
    const duration = $$(el).find('.absolute.right-2.top-2.rounded.bg-neutral-900\\/75.px-1.text-body-sm.text-primary').text().trim();
    const views = $$(el).find('span[data-testid="views"]').find('span').last().text().trim();
    const likePercentage = $$(el).find('span[data-testid="rates"]').find('span').last().text().trim();
    const channelName = $$(el).find('a[data-testid="title"] span').text().trim();
    const channelHref = $$(el).find('a[data-testid="title"]').attr('href') || '';
    const videoBadge = $$(el).find('div.absolute.left-2.top-2').text().trim();
    const previewVideo = $$(el).find('video source').attr('data-src');
    const href = `https://spankbang.com$${$$(el).find("a").attr("href")}`;
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

  return finalDataArray;

}