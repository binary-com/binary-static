const country_map = [
  "IT",
  "DE",
  "FR",
  "LU",
  "GR",
  "ES",
  "SK",
  "LT",
  "NL",
  "AT",
  "BG",
  "SI",
  "CY",
  "BE",
  "RO",
  "HR",
  "PT",
  "PL",
  "LV",
  "EE",
  "CZ",
  "FI",
  "HU",
  "DK",
  "SE",
  "IE",
  "GB",
  "MT",
];
/**
 * Returns a redirect determined by the country code
 * @param {Request} request
 */
function redirect(request) {
  // Use the cf object to obtain the country of the request
  // more on the cf object: https://developers.cloudflare.com/workers/runtime-apis/request#incomingrequestcfproperties
  const { cf, url } = request;
  const { country, isEUCountry } = cf;
  const redirect_path = "move-to-deriv";

  if (
    !url.includes(redirect_path) && // This is to avoid redirection loop
    ((country !== null && country_map.includes(country)) || isEUCountry) // Combination of Cloudflare EU country tracker and our custom country code tracker
  ) {
    const url = `https://www.binary.com/${redirect_path}`;
    return Response.redirect(url);
  } else {
    return fetch(request);
  }
}

addEventListener("fetch", (event) => {
  event.respondWith(redirect(event.request));
});
