import * as cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const URLS = {
  panel: 'https://www.dane.gov.co/index.php/indicadores-economicos'
}

async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

async function getData () {
  const $ = await scrape(URLS.panel)
  const $rows = $('table tbody tr')

  const BOARD_SELECTORS = {
    name: 'h2 strong',
    value: 'h1'
  }

  const cleanText = text => text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .replace(/[$.]/g, '')
    .replace('%', '')
    .replace('US', '')
    .trim()

  const boardSelectorEntries = Object.entries(BOARD_SELECTORS)

  const board = []
  $rows.each((index, el) => {
    const boardEntries = boardSelectorEntries.map(([key, selector]) => {
      const rawValue = $(el).find(selector).text()
      const value = cleanText(rawValue)
      return [key, value]
    })
    board.push(Object.fromEntries(boardEntries))
  })

  return board
}

const board = await getData()

const filePath = path.join(process.cwd(), 'db', 'board.json')

await writeFile(filePath, JSON.stringify(board, null, 2), 'utf-8')
