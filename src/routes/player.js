import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

router.get("/parseurl/:title", async (req, res) => {
  const { title } = req.params;
  const animeUrl = await getAnimeUrl(title);

  if (!animeUrl) {
    return res.json({ url: animeUrl });
  }

  res.json(animeUrl);
  return animeUrl;
});

const getAnimeUrl = async (title) => {
  try {
    const URL = "https://www3.gogoanimes.fi/anime-list.html";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the GoGoAnime search page
    await page.goto(URL);
    // Type the anime title into the search input field
    await page.type("input#keyword", title);
    // Click the search button
    await page.click("input.btngui");
    // Wait for the search results to load
    await page.waitForSelector(".items li");
    // Get the URL of the first search result that matches the title exactly
    const animeUrl = await page.$eval(".last_episodes > ul > li", (result) => {
      return result.querySelector(".name a").href;
    });
    //close browser
    await browser.close();

    if (!animeUrl) {
      throw new Error("Anime not found");
    }

    // Extract the anime slug from the URL
    const animeSlug = animeUrl.split("/").pop();
    console.log(animeSlug);
    return animeSlug;
  } catch (error) {
    throw error;
  }
};

export { router as PlayerRouter };
