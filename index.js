import express from 'express';

const app = express()
const port = 3000

import { searchManga, getMangaInfo, getPanelsLinks } from './queries/queries.js'

app.get('/', (req, res) => {
    res.send({
        intro: `Welcome to makima.in manga's api`,
        routes: ['/search/:query', '/info/:query', '/panels/:query'],
        website: `http://makimaa.infinityfreeapp.com/`,
        copyright: `Developed and created by Mohammad Aijaz`,
    })
})

app.get('/search/:query', async (req, res) => {
    try {
        const data = await searchManga(req.params.query);
        res.json(data)
    } catch (error) {
        res.send(error);
    }
})

app.get('/panels/:query/:lang/:chap', async (req, res) => {
    try {
        const data = await getPanelsLinks(req.params.query + "/" + req.params.lang + "/" + req.params.chap);
        res.json(data)
    } catch (error) {
        res.send(error);
    }
})

app.get('/info/:query', async (req, res) => {
    try {
        const data = await getMangaInfo(req.params.query);
        res.json(data)
    } catch (error) {
        res.send(error);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})