const Providers = (function() {
  // Get results unordered list.
  const resultsList = document.getElementById("provider-results");
  // Initialize result list items with outer scope (to be set after results are
  // populated from API).
  let resultItems;
  // Get loading message.
  const loadingMessage = document.querySelector(".loading-message");
  // Get "no results" message.
  const noResultsMessage = document.querySelector(".no-results-message");

  (async () => {
    // Get provider data.
    await fetch("https://tchcustomservices.texaschildrens.org/PublicServices/GetWaitTimes.svc/AllProviderWaitTimes")
      // Get JSON from result.
      .then(response => response.json())
      .then((data) => {
        // Parse JSON and populate providers from data.
        populate(JSON.parse(data.d));

        // Remove loading message.
        loadingMessage.remove();
      });
  })();

  /**
   * Populates empty unordered list with list items containing provider data.
   */
  function populate(providers) {
    providers.forEach((provider) => {
      // Destructure provider properties.
      const { ProviderID, DepartmentID, ProviderName, DepartmentName, WaitTime } = provider;

      // Create list item to populate.
      const result = `
        <li class="provider-result" data-provider-id="${ProviderID}" data-department-id="${DepartmentID}">
          <div class="boxed-width">
            <div>
              <p data-bind-filter-results class="provider-result__name">
                ${ProviderName} (${DepartmentName}):
                <br><span style="font-weight: 400">${getWaitTime(parseInt(WaitTime))}</span>
              </p>
            </div>

            <div class="provider-result__icon">
              <img src="images/icons/check.svg" alt=""> 
            </div>
          </div>
        </li>
      `;

      // Convert result string to fragment and append to results ul.
      resultsList.appendChild(document.createRange().createContextualFragment(result));
    });

    // Add hook indicating data has been successfully populated.
    resultsList.setAttribute("data-populated", true);

    // Get populated items.
    resultItems = document.querySelectorAll(".provider-result");
  }

  /**
   * Returns a message with the time range that the actual wait time from the
   * API fits within.
   */
  function getWaitTime(waitTime) {
    let result;

    // Define ranges.
    const ranges = [
      [0, 15],
      [16, 30],
      [31, 45],
      [46, 60],
    ];

    ranges.forEach((range) => {
      // Destructure each range array for easier access to the values.
      const [min, max] = range;

      // Check if given wait time is between current minimum and maximum range.
      if(waitTime >= min && waitTime <= max) {
        // Return the range.
        result = `Wait Time: ${min}–${max} Minutes`;
      } else if(waitTime > max) {
        // Return modified message if the wait time exceeds all maximums.
        result = "Your wait time is currently unavailable. Please visit the front desk if you are interested in learning more about your wait time.";
      }
    });

    return result;
  }
  
  // If the inner text of the result li matches the search term value (case
  // insensitive), unhide the result. Otherwise, hide it.
  function filter(currentValue) {
    // Exit if no data has been populated.
    if(!resultsList.dataset.populated) return;

    resultItems.forEach((result) => {
      // Get result.
      const resultName = result.querySelector("[data-bind-filter-results]").textContent;

      // If result matches the current search term...
      if(resultName.toUpperCase().indexOf(currentValue.toUpperCase()) > -1) {
        // Show it.
        showResult(result);
      } else {
        // Otherwise, hide it.
        if("onanimationend" in document.createElement("div")) {
          // Add a hook for attaching a CSS animation.
          result.setAttribute("data-transition", "hiding");

          // Wait until after that animation finishes to hide it.
          result.onanimationend = () => {
            hideResult(result);
          };
        } else {
          // If "onanimationend" is not supported, just hide without an
          // animation.
          hideResult(result);
        }
      }
    });
  }

  function hideResult(result) {
    result.hidden = true;
    result.removeAttribute("data-transition");
    checkIfHideAll();
  }

  function showResult(result) {
    result.onanimationend = null;
    result.removeAttribute("data-transition");
    result.hidden = false;
    checkIfHideAll();
  }

  function checkIfHideAll() {
    // Create an array out of provider results that are not hidden.
    const remainingResults = Array.from(resultItems).filter((result) => {
      return result.hidden === false;
    });

    // Show or hide the "no results" message depending on whether that array is
    // empty or populated, respectively.
    noResultsMessage.hidden = (remainingResults.length > 0);
  }

  return {
    filter: filter,
  };
}());