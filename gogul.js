import parse from "node-html-parser"
import fetch from "node-fetch"
const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_4 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) GSA/68.0.234683655 Mobile/14G61 Safari/602.1"

function pull(params, cb) {
	function get(start,callback) {
		let url = [
			"https://www.google.com/search",
			"?q=" + params.q,
			(params.hl ? "&hl=" + params.hl : ""),
			(params.lr ? "&lr=" + params.lr : ""),
			(params.start ? "&start=" + params.start : ""),
			"&biw=320&source=mobilesearchapp&oq=test&channel=iss&pbx=1",
			"&subts=" + Math.floor(Date.now() / 1000) + "&v=68.0.234683655",
			"&vpa=2&vse=1&wf=pp1&ie=UTF-8",
			"&ntyp=1&client=mobilesearchapp&ioshw=iPhone5,2&bih=548"
		].join("")
		fetch(url, {
			"headers": {
				"Accept": "text/html",
				"User-Agent": ua,
				"Cookie": ""
			}
		}).then(r => {r.text().then(r => {
			let z = parseF(r)
			callback(z)
		})})
	}
	let fullResults = []
	get(params, (data => {
		data.forEach(result => {
			fullResults.push(result)
		})
		if(fullResults.length < 10) {
			let start = (params.start || 0) + fullResults.length
			params.start = start;
			get(params, (data => {
				data.forEach(result => {
					fullResults.push(result)
				})
				let addedUrls = []
				let fTemp = []
				fullResults.forEach(z => {
					if(!addedUrls.includes(z.link)) {
						fTemp.push(z)
						addedUrls.push(z.link)
					}
				})
				fullResults = fTemp
				fullResults.shift()
				if(fullResults.length > 10) {
					fullResults = fullResults.slice(0,10)
				}
				cb(fullResults)
			}))
		} else {
			if(fullResults.length > 10) {
				fullResults = fullResults.slice(0,10)
			}
			fullResults.shift()
			cb(fullResults)
		}
	}))
}

function resolveAsyncrap(params) {
	return new Promise((resolve) => {
		exports.list(params, (data) => {
			resolve({"data": {
				"items": data,
				"searchInformation": {
					"formattedTotalResults": 1
				}
			}})
		})
	})
}

let exports = {}

exports.list = function(params,callback) {
	pull(params,callback)
}
exports.asyncList = async function(params) {
	const result = await resolveAsyncrap(params);
	return result;
}

export default exports;

function parseF(response) {	
	let parsedResults = []
	let f = parse.parse(response)
	f = f.querySelectorAll(`a[href*="/url?q="]`)
	f.forEach(z => {
		if(z.querySelector("h3")) {
			let desc = z.parentNode.parentNode.querySelectorAll("div")
			let divArray = []
			desc.forEach(x => {
				divArray.push(x)
			})
			divArray = divArray.reverse()
			divArray.slice(0,10).forEach(div => {
				if(div.innerHTML.slice(0,60) == div.innerText.slice(0,60)
				&& div.innerHTML.length>2
				&& typeof desc !== "string"
				&& !div.innerHTML.slice(0,30).includes(">")
				&& !div.innerHTML.slice(0,30).includes("›")) {
					desc = div.innerText
				}
			})
			let result = {
				"htmlTitle": z.querySelector("h3").innerText,
				"htmlSnippet": (typeof desc == "string" ? desc : ""),
				"link": decodeURIComponent(
					z.getAttribute("href").split("/url?q=")[1].split("&")[0]
				),
				"htmlFormattedUrl": decodeURIComponent(
					z.getAttribute("href").split("/url?q=")[1].split("&")[0]
				),
				"displayLink": decodeURIComponent(
					z.getAttribute("href").split("/url?q=")[1].split("&")[0]
				)
			}
			parsedResults.push(result)
		}
	})
	
	return parsedResults;
}