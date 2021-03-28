let weekdays = [
	"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

let dayEndings = [
	"th", // 10th
	"st", // 1st
	"nd", // 2nd
	"rd", // 3rd
	"th", // 4th
	"th", // 5th
	"th", // 6th
	"th", // 7th
	"th", // 8th
	"th"  // 9th
]

if(document.getElementById("this-week-list") !== null) {


let thisWeekList = document.getElementById("this-week-list");
let thisWeekBoxes = thisWeekList.querySelectorAll(".day-box");
let thisWeekBoxesDayNumber = thisWeekList.querySelectorAll(".day-number");


// Create function to generate recipe link
	function generateRecipeLink(meal) {
		let link = document.createElement("a");
		link.href = "recipes/" + meal.url + "/";
		link.textContent = meal.name;
		return link;
	}


// Clean LocalStorage on load
let distanceBetweenOneMonth = 2547000000;
Object.keys(localStorage).forEach((key) => {
	if(key.includes("day-")) {
		let obj = key.split("-");
		let year = parseInt(obj[1]);
		let month = parseInt(obj[2]);
		let day = parseInt(obj[3]);

		let newDate = new Date(year, month, day);
		let dayJSObject = dayjs(dayjs(newDate) + distanceBetweenOneMonth);

		if(dayjs() > dayJSObject) {
			localStorage.removeItem(key);
		}
	}
});


// Get the 0-6 day of the week number
let currentDayOfTheWeek = dayjs().day();
// Get the current day like 25, or 31
let currentDayNumber = dayjs().date();

// Total number of weeks to show
let weeksToShow = 3;
let totalNumberOfDaysShown = weeksToShow * 7;

// Loop through every day and add the day number, along with selected meals
for (let i = 0; i < totalNumberOfDaysShown; i++) {
	let dayNumber = dayjs().add(i - dayjs().day(), 'day')['$D'];
	let monthNumber = dayjs().add(i - dayjs().day(), 'day')['$M'];
	let yearNumber = dayjs().add(i - dayjs().day(), 'day')['$y'];
	thisWeekBoxesDayNumber[i].innerText = dayNumber;

	// This is the ID to represent the day. something like day-3-21 for April 21st
	// This is indexed 0 to 11 for the months
	thisWeekBoxes[i].id = "day-" + yearNumber + "-" + monthNumber + "-" + dayNumber;
	thisWeekBoxes[i].setAttribute("data-day", dayjs().day(i)['$W']);

	// Check for localstorage and fill in previously set meals
	if(localStorage.getItem(thisWeekBoxes[i].id) !== null) {
		// Get the info about the meal
		mealJSON.forEach(function(meal) {
			if(meal.id === String(localStorage.getItem(thisWeekBoxes[i].id))) {
				if(thisWeekBoxes[i].querySelector(".show-days-meal") !== null) {
					thisWeekBoxes[i].querySelector(".show-days-meal").append(generateRecipeLink(meal));
				}
			}
		})
	}
}

thisWeekBoxes[currentDayOfTheWeek].classList.add("active");







let dinnerModal = document.getElementById('add-meal-item')
dinnerModal.addEventListener('show.bs.modal', function (event) {
	let dayOfTheWeek = parseInt(event.relatedTarget.closest(".day-box").getAttribute("data-day"));
	let dateNumber = parseInt(event.relatedTarget.closest(".day-box").querySelector(".day-number").innerText);

	// This is the name of the local storage variable
	let saveID = event.relatedTarget.closest(".day-box").id;
	document.getElementById("chosen-date").value = saveID;

	// Build the st, nd, rd, and th endings.
	let lastDigit = String(dateNumber);
	lastDigit = parseInt(lastDigit[lastDigit.length - 1]);

	// Set the modal title
	let modalTitle = weekdays[dayOfTheWeek] + ", the " + dateNumber + dayEndings[lastDigit];
	document.getElementById("add-meal-item-title").querySelector("span").innerText = modalTitle;
})





// Saving the meals
document.getElementById("save-meal").addEventListener("submit", function(e) {
	e.preventDefault();

	let key = this.querySelector("#chosen-date").value;
	let value = this.querySelector("#chosen-meal").value;
	localStorage.setItem(key, value);

	// Get the info about the meal
	mealJSON.forEach(function(meal) {
		if(meal.id === String(value)) {
			document.getElementById(key).querySelector(".show-days-meal").append(generateRecipeLink(meal));
		}
	})



	document.getElementById("close-dinner-modal").click();
})
}
