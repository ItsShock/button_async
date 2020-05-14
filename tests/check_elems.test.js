const puppeteer = require('puppeteer');
let urlToTest = "http://127.0.0.1:8080/";

describe("Zadanie nr. 2", () => {
  const timeout = 30000;
  let page;
  let didRequest;

  beforeAll(async () => {
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.goto(urlToTest);
    await page.waitFor(1000);
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
      if (interceptedRequest.url() === 'https://api.thecatapi.com/v1/images/search') {
        didRequest = true;
      }
      interceptedRequest.continue();
    });
  }, timeout);

  afterAll(async () => {
    await browser.close();
  })

  it("Dodano button o odpowiednim ID", async () => {
    const button = await page.$eval("#searchKitty", elem => !!elem);
    expect(button).toBe(true);
  }, timeout);

  it("Po kliknięciu w button, powinno załadować się zdjęcie kotka i dodać do DOM", async () => {
    await page.click("#searchKitty");

    await page.waitForSelector("img");
    const img = await page.$eval("img", elem => !!elem);
    expect(img).toBe(true);
  }, timeout);

  it("Wszystko powinno być poprzedzone poprawnym requestem", async () => {
    expect(didRequest).toBe(true);
  }, timeout);
});
