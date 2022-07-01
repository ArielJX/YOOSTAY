const searchButton = document.querySelector("#search-button");
const searchInput = document.querySelector("#search-input");
const groupSizeInput = document.querySelector("#group-days");
let cardArray;
let categoryArray;
var closeBtn = document.getElementById('closeBtn');


function closeModal() {
  closeBtn.addEventListener('click', closeModal);
  modal.classList.addEventListener("hidden");
}
// to use this datepicker, you will need to create an input element with an id. Put the id of the input you want to attach flatpickr to in the selector string.
// You'll also need to include a reference to the maxDays for the chosen option so that it knows how many days to limit the range too, otherwise it defaults to 2 days.
const datepickerInstance = flatpickr("#put-your-inputs-id-here!!!", {
  mode: "range",
  minDate: "today",
  dateFormat: "Y-m-d",
  // when the input changes (i.e. a date is selected), do this.
  onChange: function (dates, string, pickr) {
    maxDays = /* PUT SELECTED OPTIONS' MAX NUMBER OF DAYS HERE */"";
    // if only a single date is chosen, set the max to maxDays from the selected date, 
    if (dates.length === 1) {
      pickr.set(
        "maxDate",
        dates[0].fp_incr(maxDays - 1 || 1)
      );
      // and the min to the selected date (to prevent selecting previous days)
      pickr.set("minDate", dates[0]);
    } else {
      // else it must mean that a second date just got picked, so calculate the difference
      // convert date objects passed to the event handles to epoch time integers (milliseconds from 1st Jan 1970 (don't ask, its a compsci thing)) and subtract them
      let timeDifference = dates[1].getTime() - dates[0].getTime();
      // convert the milliseconds into days (1000 milliseconds to a second, 3600 seconds in an hour, 24 hours a day)
      let numberOfDays = 1 + Math.floor(timeDifference / (1000 * 3600 * 24));

      // THESE ARE YOUR OUTPUTS!
      // numberOfDays is the total number of days in the selected range.
      // string is the date range written as a human readable string (xxxx-xx-xx to xxxx-xx-xx)
      // dates is an array of the individual date strings
      console.log(numberOfDays, string, dates); // -------------------->>>>>> USE ANY OF THESE VALUES AS THE OUTPUT FOR THE REST OF YOUR CODE. CALL A FUNCTION HERE OR WHATEVER, UP TO YOU. THIS SECTION OF THE CODE WILL EXECUTE EVERYTIME A PAIR OF DATES IS SELECTED
      // do with these what you wish :)
    }
  },
  onClose: function (dates, string, pickr) {
    pickr.set("maxDate", null);
    pickr.set("minDate", "today");
  },
});
async function fetchCardJson() {
  const response = await fetch("/cards.json");
  const data = await response.json();
  cardArray = data.cards;
  categoryArray = data.categories;
  displayCategory("#sticky-categories");
  displayCategory("#categories");
  displayCardData(cardArray);
  selectCategoryCard();
  prepareSearch();
}

function displayCardData(array) {
  let html = ``;
  for (let object of array) {
    html +=
      `
    <div data-id="${object.id}" class="card">
      <div class="card-crop">
        <img src="${object.imgUrl}">
      </div>
      <div class="card-info">
        <div class="card-info-top">
          <div class="left">
            <span class="category">${object.category}</span>
            <h3 class="title">${object.title}</h3></div> 
            <div class="right"><p class="price">${object.price}</p>
          </div>
        </div>
        <div class="card-info-bottom">
          <p class="maxPeople">Max ${object.maxPeople} People</p>
        </div>
       </div>
    </div>`
  }

  document.querySelector(".accommodation-cards").innerHTML = html;

  ///////                  ////////
  ///////     modal        ////////
  ///////                  ////////
  const cardList = document.querySelectorAll(".card");
  for (let card of cardList) {
    //console.log(card);
    card.addEventListener("click", function (event) {
      const targetArray = event.currentTarget.dataset.id;
      //console.log(targetArray)
      showCard(targetArray);

    })
  }
}
//.find(function(item))
function showCard() {
  //   console.log(id)
  document.querySelector(".modal").classList.remove("hidden");
  //   let html = '';
  //   for (let object of cardArray) {
  //     html = `    
  //     <span class="closeBtn">&times;</span>
  //     <div class="screen1">
  //       <div class="card-crop">
  //         <img src="${object.imgUrl}">
  //       </div>
  //       <div class="card-info">
  //         <h3 class="title">${object.title}</h3>
  //         <span class="address">${object.address}</span>
  //         <p class="price">${object.price}</p>
  //         <p class="maxPeople">${object.descrption}</p>
  //       </div>
  //     </div>
  //     <div class="screen2">
  //       <div class="box1">
  //         <p class="descrption">${object.descrption}
  //         </p>
  //       </div>
  //       <div class="facilities box2">
  //         <ul>
  //           <li>${object.facilities}</li>
  //         </ul>
  //       </div>
  //     </div>
  //     <div class="screen3">
  //       <div class="row row-border">
  //         <div class="col">Sleep</div>
  //         <div class="col">Room Type</div>
  //         <div class="col">Meals</div>
  //         <div class="col">Total Cost</div>
  //       </div>
  //       <div class="row">
  //         <div class="col"><img src="icons/sleep.png"></div>
  //         <div class="col">Room Type</div>
  //         <div class="col">Meals</div>
  //         <div class="col">Total Cost</div>
  //       </div>
  //       <div class="row cost-col">
  //         <div class="col">$$$$</div>
  //       </div>
  //     </div>

  //     <div class="screen4">
  //       <div class="comment">
  //         <textarea id="title" type="text " rows="2" cols="4" onkeyup="Allow()"
  //           placeholder="write a comment......"></textarea>
  //         <input type="submit" value="submit" onclick="insert()" style="width:60px;" /></form>
  //       </div>
  //       <div id="display"></div>
  //     </div>
  // `}
  document.querySelector(".modal").innerHTML = html;
}


///////                               ////////
///////     All categories filter     ////////
///////                               ////////

function displayCategory(elementId) {
  let categoryHTML = "<option class='category' value='all'><p>All Categories</p></option>";
  for (let category of categoryArray) {
    categoryHTML += `<option class="category" value="${category.id}"><p>${category.name}</p></option>`
  }
  const selectedCategory = document.querySelector(elementId);

  selectedCategory.innerHTML = categoryHTML;

  selectedCategory.addEventListener('change', function (event) {
    console.log(event.currentTarget.value);
    if (event.currentTarget.value === "all") {
      displayCardData(cardArray);

    } else {
      filterCardsByCategoryID(selectedCategory.value)
    }
  })
}

function selectCategoryCard(value) {
  let categoryCardList = document.querySelectorAll(".option");
  for (let categoryItem of categoryCardList) {
    categoryItem.addEventListener('click', function (event) {
      filterCardsByCategoryID(event.currentTarget.dataset.value);
    });
  }
}

function filterCardsByCategoryID(value) {

  let matches = cardArray.filter(function (item) {
    return item.categoryID == value;
  })
  displayCardData(matches);
}


///////                      ////////
///////     SearchBar        ////////
///////                      ////////

function prepareSearch() {
  searchButton.addEventListener("click", function () {
    filterCards(searchInput.value);
  });
  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "enter") {
      filterCards(searchInput.value);
    }
  })
}

function filterCards(filterString) {
  let matches = [];
  for (let card of cardArray) {
    if (card.title.toLowerCase().includes(filterString.toLowerCase())) {
      matches.push(card);
    }
  }
  displayCardData(matches);
}


fetchCardJson();

window.onscroll = function () { stickyFunction() };
function stickyFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.querySelector(".sticky").style.top = "0";
  } else {
    document.querySelector(".sticky").style.top = "-100px";
  }
}