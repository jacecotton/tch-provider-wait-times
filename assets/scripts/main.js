const Providers = (function() {
  // Get results unordered list.
  const resultsList = document.getElementById("provider-results");
  // Get "no results" message.
  const noResultsMessage = document.querySelector(".no-results-message");

  async function init() {
    // Get provider data.
    const providers = await fetchData().then((data) => {
      // Populate based on the returned data.
      populate(data);
    });
  }

  /**
   * Fetches provider data.
   */
  async function fetchData() {
    return await fetch("https://tch-bus-dev-waittimes-aps-01.tch-bus-dev-ase-01.p.azurewebsites.net/PublicServices/GetWaitTimes.svc/AllProviderWaitTimes")
      .then(response => response.json())
      .then(data => {
        return JSON.parse(data.d);
      });
  }

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
              <p class="provider-result__name">
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

      // Hide no results message.
      noResultsMessage.hidden = true;
    });

    // Add hook indicating data has been successfully populated.
    resultsList.setAttribute("data-populated", true);
  }

  /**
   * Gets the range associated with the given wait time.
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
      const [min, max] = range;

      // Check if given wait time is between minimum and maximum range
      // (destructured above).
      if(waitTime >= min && waitTime <= max) {
        result = `Wait Time: ${min}–${max} Minutes`;
      } else if(waitTime > max) {
        // Return error message if the wait time exceeds all maximums.
        result = "Your wait time is currently unavailable. Please visit the front desk if you are interested in learning more about your wait time.";
      }
    });

    return result;
  }
  
  function filter(currentValue) {
    // Exit if no data has been populated.
    if(!resultsList.dataset.populated) return;

    // Get result li.
    const resultItems = document.querySelectorAll(".provider-result");

    resultItems.forEach((result) => {
      // If the inner text of the result li matches the search term value (case
      // insensitive), unhide the result. Otherwise, hide it.
      const resultName = result.querySelector(".provider-result__name").textContent;

      if(resultName.toUpperCase().indexOf(currentValue.toUpperCase()) > -1) {
        result.onanimationend = null;
        result.removeAttribute("data-transition");
        result.hidden = false;
      } else {
        if("onanimationend" in document.createElement("div")) {
          // Add a hook for attaching a CSS animation.
          result.setAttribute("data-transition", "hiding");

          // Once that animation finishes, hide the result and remove the hook.
          result.onanimationend = () => {
            result.hidden = true;
            result.removeAttribute("data-transition");

            // Check if all results are hidden and show a no results message if
            // so.
            checkIfHideAll();
          };
        } else {
          result.hidden = true;
          result.removeAttribute("data-transition");
          checkIfHideAll();
        }
      }
    });

    function checkIfHideAll() {
      // Create an array out of provider results that are not hidden.
      const remainingResults = Array.from(resultItems).filter((result) => {
        return result.hidden === false;
      });

      // If that array is empty, show the no results message. Otherwise, hide
      // it.
      if(remainingResults.length === 0) {
        noResultsMessage.hidden = false;
      } else {
        noResultsMessage.hidden = true;
      }
    }

    checkIfHideAll();
  }

  return {
    init: init,
    filter: filter,
  };
}());

Providers.init();