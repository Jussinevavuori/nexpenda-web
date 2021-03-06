
function extractValueByPrefix(search, prefix) {
	const regexp = new RegExp(`${prefix}+:([^\\s]+)`, "gmi");
	const match = search.match(regexp);
	if (match) {
		return match[0].split(":")[1];
	}
}

function test(search, prefix) {
	const value = extractValueByPrefix(search, prefix)
	console.log(prefix, ": ", value)
}

test("testi category:moikka catgory:testi", "category")
