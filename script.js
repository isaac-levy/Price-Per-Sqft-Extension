const getPriceFromEl = (el) => Number(el?.textContent.trim().replace("$", "").replaceAll(",", ""));
const getSqftFromEl = (el, selectorClass) => Number(Array.from(el.querySelectorAll(selectorClass)).pop()?.textContent.split(" ")[0]);

/* type = "list" | "map" | "page" */
const getPriceElements = (card, type) => {
  let priceContainer = null;
  let selectorClass = "";

  if (type === "list") {
    priceContainer = card.querySelector(".listingCardPrice");
    selectorClass = ".listingCardIconNum";
  } else if (type === "map") {
    priceContainer = card.querySelector(".smallListingCardPrice");
    selectorClass = ".smallListingCardIconNum";
  } 
  else if (type === "page") {
    priceContainer = card.querySelector("#listingPriceValue");
    selectorClass = ".listingIconNum";
  }

  return [priceContainer, (getPriceFromEl(priceContainer) / getSqftFromEl(card, selectorClass)).toFixed(2)];
}

const setPricePerSqft = (cards, type) => {
  cards.forEach(card => {
    const [priceContainer, pricePerSqft] = getPriceElements(card, type);

    if (priceContainer && !isNaN(pricePerSqft)) {
      const fontSize = (
        type === "list" ? 18 :
        type === "page" ? 24 :
        16 
      );
      priceContainer.insertAdjacentHTML("beforeend", `
        <span style="font-size: ${fontSize}px;">
           ($${pricePerSqft}/sqft)
        </span>
      `);
    }
  });
}

const getPageType = () => {
  const { href } = window.location;
  
  return (
    (href.includes("map") && href.includes("view=list")) ? "list" :
    href.includes("map") ? "map" :
    href.includes("real-estate") ? "page" :
    ""
  )
};

setInterval(() => {
  const pageType = getPageType();
  const cards = (
    pageType === "map" ? Array.from(document.querySelectorAll("#mapSidebarBodyCon .cardCon")) : 
    pageType === "list"  ? Array.from(document.querySelectorAll("#listInnerCon .listingCard"))  :
    pageType === "page" ? [document.getElementById("listingBodyCon")] :
    []
  );

  if (cards.length && pageType) {
    setPricePerSqft(cards, pageType);
  }
}, 2500);