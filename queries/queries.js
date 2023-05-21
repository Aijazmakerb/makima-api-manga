import { load } from "cheerio";
import axios from "axios";

const baseUrl = 'https://mangareader.to';

export const getPanelsLinks = async(query) => {
    try {
        const response = await axios.get(`${baseUrl}/read/${query}`);
        const $ = load(response.data);

        const readingId = $('div#wrapper').attr('data-reading-id');

        const ajaxURL = `https://mangareader.to/ajax/image/list/chap/${readingId}?mode=vertical&quality=high`;
        const { data: pagesData } = await axios.get(ajaxURL);
        const $PagesHTML = load(pagesData.html);
        const pagesSelector = $PagesHTML('div#main-wrapper div.container-reader-chapter div.iv-card');
        const pages = pagesSelector
            .map((i, el) => ({
                img: $(el).attr('data-url').replace('&amp;', '&'),
                page: i + 1,
            }))
            .get();
        return pages;
    } catch (error) {
        return error;
    }
}

export const getMangaInfo = async(mangaId) => {
    const mangaInfo = {
        id: mangaId,
        title: '',
    };
    try{
        const response = await axios.get(`${baseUrl}/${mangaId}`)
        const $ = load(response.data);

        const container = $('div.container');
        mangaInfo.title = container.find('div.anisc-detail h2.manga-name').text().trim();
        mangaInfo.image = container.find('img.manga-poster-img').attr('src');
        mangaInfo.description = $('div.modal-body div.description-modal').text().split('\n').join(' ').trim();

        mangaInfo.genres = container
            .find('div.sort-desc div.genres a')
            .map((i, genre) => $(genre).text().trim())
            .get();

        mangaInfo.chapters = container
            .find(`div.chapters-list-ul ul li`)
            .map((i, el) => {
                var _a;
                return ({
                    id: (_a = $(el).find('a').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/read/')[1],
                    title: $(el).find('a').attr('title').trim(),
                    chapter: $(el).find('a span.name').text().split('Chapter ')[1].split(':')[0],
                });
            })
            .get();
        return mangaInfo;
    }catch(error){
        return error;
    }   
}

export const searchManga = async(query) => {
    try {
        const response = await axios.get(`${baseUrl}/search?keyword=${query}`);
        const $ = load(response.data);

        const results = $('div.manga_list-sbs div.mls-wrap div.item')
            .map((i, el) => {
                var _a;
                return ({
                    id: (_a = $(el).find('a.manga-poster').attr('href')) === null || _a === void 0 ? void 0 : _a.split('/')[1],
                    title: $(el).find('div.manga-detail h3.manga-name a').text().trim(),
                    image: $(el).find('a.manga-poster img').attr('src'),
                    genres: $(el)
                        .find(`div.manga-detail div.fd-infor span > a`)
                        .map((i, genre) => $(genre).text())
                        .get(),
                });
            })
            .get();
        return {
            results: results,
        };
    } catch (error) {
        return error;
    }
}