const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");



// Custom additions
const MinifyCSS = require("clean-css");
const slugify = require("slugify");




module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight);
	eleventyConfig.addPlugin(pluginNavigation);

	eleventyConfig.setDataDeepMerge(true);

	eleventyConfig.addLayoutAlias("post", "source/layouts/post.njk");

	eleventyConfig.addFilter("readableDate", dateObj => {
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
	});

	// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	eleventyConfig.addCollection("tagList", function(collection) {
		let tagSet = new Set();
		collection.getAll().forEach(function(item) {
			if( "tags" in item.data ) {
				let tags = item.data.tags;

				tags = tags.filter(function(item) {
					switch(item) {
						// this list should match the `filter` list in tags.njk
						case "all":
						case "nav":
						case "post":
						case "posts":
							return false;
					}

					return true;
				});

				for (const tag of tags) {
					tagSet.add(tag);
				}
			}
		});

		// returning an array in addCollection works in Eleventy 0.5.3
		return [...tagSet];
	});




	// Custom
	eleventyConfig.addFilter("minifyCSS", function(code) {
		return new MinifyCSS({}).minify(code).styles;
	});

	eleventyConfig.addFilter("slugURL", function(urlString) {
		return slugify(urlString, {
			replacement: '-',
			remove: undefined,
			lower: true,
			strict: true
		});
	});

	eleventyConfig.addShortcode("dateYear", function() {
		/* {% dateYear %} */
		return DateTime.local().toFormat("yyyy");
	});

	eleventyConfig.addShortcode("icon", function(name) {
		/* {% icon house %} */
		let iconName = "node_modules/bootstrap-icons/icons/" + name + ".svg";
		return fs.readFileSync(iconName).toString();
	});










	function createCompiledMealsFile() {
		let mealsArray = [];
		let directory = "source/_data/meals/";

		fs.readdir(directory, function (error, files) {
			//handling error
			if (error) {
				return console.log('Unable to scan directory: ' + error);
			}

			//listing all files using forEach
			files.forEach(function (fileName) {
				// Push to the mealsArray
				let meal = fs.readFileSync(directory + fileName, "utf8");
				let mealJSON = JSON.parse(meal);
				mealsArray.push(mealJSON);
			});

			let compiledMealsFile = JSON.stringify(mealsArray);

			fs.writeFileSync("source/_data/mealsCompiled.json", compiledMealsFile, function (err) {
				if (err) throw err;
				console.log('Error with compiling the meals file');
			});

		});
	}

	createCompiledMealsFile();





	eleventyConfig.addPassthroughCopy({"source/images": "images"});
	eleventyConfig.addPassthroughCopy({"source/manifest.json": "manifest.json"});
	eleventyConfig.addPassthroughCopy({"source/robots.txt": "robots.txt"});
	eleventyConfig.addPassthroughCopy({"source/_includes/partial-css/bootstrap.css": "css/bootstrap.css"});
	eleventyConfig.addPassthroughCopy({"source/_includes/partial-js/bootstrap.js": "js/bootstrap.js"});

	eleventyConfig.addPassthroughCopy({"source/_data/meals-compiled.json": "js/meals.json"});




	/* Markdown Overrides */
	let markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItAnchor, {
		permalink: true,
		permalinkClass: "direct-link",
		permalinkSymbol: "#"
	});
	eleventyConfig.setLibrary("md", markdownLibrary);

	// Browsersync Overrides
	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready: function(err, browserSync) {
				const content_404 = fs.readFileSync('_site/404.html');

				browserSync.addMiddleware("*", (req, res) => {
					// Provides the 404 content without redirect.
					res.write(content_404);
					res.end();
				});
			},
		},
		ui: false,
		ghostMode: false
	});

	return {
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid"
		],

		// If your site lives in a different subdirectory, change this.
		// Leading or trailing slashes are all normalized away, so don???t worry about those.

		// If you don???t have a subdirectory, use "" or "/" (they do the same thing)
		// This is only used for link URLs (it does not affect your file structure)
		// Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

		// You can also pass this in on the command line using `--pathprefix`
		// pathPrefix: "/",

		markdownTemplateEngine: "liquid",
		htmlTemplateEngine: "njk",
		dataTemplateEngine: "njk",

		// These are all optional, defaults are shown:
		dir: {
			input: ".",
			includes: "source/_includes",
			data: "source/_data",
			output: "_site"
		}
	};
};
