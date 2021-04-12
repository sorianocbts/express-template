import axios from 'axios'
import cheerio from 'cheerio'

// Get page html
export async function getHTML(pageUrl) {
    const { data: html } = await axios.get(pageUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
        }
    })
        .catch(function (error) {
            console.log(error);
        })
    return html;
}

// Parse Page data
export async function getPageData(html) {
    const $ = cheerio.load(html)

    //Page Info

    const title = await $("#page-title").html() //.replace(/\s\s+/g, " ")
    const content = await $("#page-title").nextUntil(".navigation").html()
    const bibleReference = await $("#page-title").next().next().html()
    const EntireDiv = await $(".navigation").first().siblings().html() //[0].siblings().map((i, el) => {
    //     return $(this).html()
    // })
    const Data = {
        Chapter: title.replace(/\D/g, ''),
        Title: title.split('- ')[1],
        Sections: [
            {
                Content: content,
                BibleReference: bibleReference
            }
        ],
        EntireDiv
    }
    return await Data
}



const pageUrl = process.env.PAGE_URL

// Send product data 
export async function scrapePage() {
    const html = await getHTML(pageUrl);
    const pageData = await getPageData(html);
    return pageData
}