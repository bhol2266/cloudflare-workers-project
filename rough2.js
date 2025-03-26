const { load } = require("cheerio");



async function getCreators() {


    // const requestBody = await request.json();
    // let url = requestBody.url;
    let url = "https://spankbang.party/creators";

    const response = await fetch(url);
    const html3 = await response.text();
    const $2 = load(html3);


    const finalDataArray = [];

    $2("#channels a").each((i, el) => {

        const creatorHref = $2(el).attr('href') || '';
        var creatorImage = $2(el).find('img').attr('data-src') || $2(el).find('img').attr('src');
        const creatorViews = $2(el).find('.absolute.bottom-2.left-2').text().trim();
        const creatorVideos = $2(el).find('.absolute.bottom-2.right-2').text().trim();
        const creatorName = $2(el).find('span.text-body-lg.text-link-secondary').text().trim();
        if (creatorImage) {
            creatorImage = creatorImage.replace(/^\/\//, "https://").replace(".com", ".party");
          }

          if (creatorName.length != 0 || creatorName != null) {
            finalDataArray.push({
              creatorHref,
              creatorImage,
              creatorViews,
              creatorVideos,
              creatorName
            });
          }
    
    });


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

    console.log(finalDataArray, pages);



}

getCreators()