export default function Scrape_Video_Item($2) {
    const finalDataArray = [];
    $2(".main_results .video-item").each((i, el) => {
      const thumbnail = $2(el).find("picture img").attr("data-src");
      const title = $2(el).find("picture img").attr("alt");
      const duration = $2(el).find(".l").text();
      const views = $2(el).find(".stats .v").text().trim();
      const likePercentage = $2(el).find(".stats .r").text().trim();
      const uploadedTime = $2(el).find(".stats .d").text().trim();
      const videoBadge = $2(el).find(".video-badge.h").text().trim();
      const previewVideo = $2(el).find("picture img").attr("data-preview");
      const href = `https://spankbang.com${$2(el).find("a").attr("href")}`;
      if (href !== void 0 && previewVideo !== void 0 && !thumbnail.includes("//assets.sb-cd.com")) {
        finalDataArray.push({
          thumbnail,
          title,
          duration,
          views,
          likePercentage,
          uploadedTime,
          videoBadge,
          previewVideo,
          href
        });
      }
    });
    if (finalDataArray.length == 0) {
      $2(".video-item").each((i, el) => {
        const thumbnail = $2(el).find("picture img").attr("data-src");
        const title = $2(el).find("picture img").attr("alt");
        const duration = $2(el).find(".l").text();
        const views = $2(el).find(".stats .v").text().trim();
        const likePercentage = $2(el).find(".stats .r").text().trim();
        const uploadedTime = $2(el).find(".stats .d").text().trim();
        const videoBadge = $2(el).find(".video-badge.h").text().trim();
        const previewVideo = $2(el).find("picture img").attr("data-preview");
        const href = `https://spankbang.com${$2(el).find("a").attr("href")}`;
        if (href !== void 0 && previewVideo !== void 0 && !thumbnail.includes("//assets.sb-cd.com")) {
          finalDataArray.push({
            thumbnail,
            title,
            duration,
            views,
            likePercentage,
            uploadedTime,
            videoBadge,
            previewVideo,
            href
          });
        }
      });
    }
    return finalDataArray;
  }