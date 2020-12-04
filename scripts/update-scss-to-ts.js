const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

/**
 * Get the path to the styles/main.scss file
 */
const scssSrcFilePath = path.join(__dirname, "../src/styles/main.scss")

/**
 * Get the path to the exported styles/main.ts file
 */
const tsSrcFilePath = path.join(__dirname, "../src/styles/main.ts")

/**
 * Regex to match any SCSS variable declaration row. The row must...
 * - Start with "$""
 * - Contain a non-empty variable name, consisting of lowercase and
 *   uppercase alphabet, digits or the characters "-" or "_"
 * - Continue with the character ":" and any amount of whitespace
 * - Continue with any non-empty value
 * - End with the character ";"
 */
const scssVariableRegex = /(\$)((\w|-)+)(:\s*)(.+)(;)/

/**
 * Read the main SCSS File
 */
fs.readFile(scssSrcFilePath, (err, data) => {

	/**
	 * In case of error, log error and exit
	 */
	if (err) {
		console.error(err)
		return process.exit(1)
	}

	/**
	 * Read the rows from the file
	 */
	const file = data.toString("utf-8")
	const rows = file.split("\n")

	console.log(chalk.green(`SCSS source file succesfully read.`))
	console.log(chalk.white(`Found ${rows.length} rows.`))

	/**
	 * Get only rows which contain a variable declaration
	 */
	const scssVariableRows = rows.filter(row => {
		return !!scssVariableRegex.exec(row)
	})

	console.log(chalk.white(`Found ${scssVariableRows.length} variable declarations.`))

	/**
	 * Map the SCSS variables into an object. In all SCSS variable names,
	 * change "-" to "_".
	 */
	const scssVariables = Object.fromEntries(
		scssVariableRows.map(row => {
			return row
				.split(":")
				.map(_ => _.trim().replace(/(;|\$)/g, "").replace(/-/g, "_"))
		})
	)

	console.log(chalk.white(`Parsed variables.`))

	/**
	 * Generate the styles/main.ts file as a string
	 */
	const generatedTsObjectRows = Object.entries(scssVariables)
		.map(entry => {
			const [name, value] = entry
			return `\t${name}: \`${value}\`,`
		})
	const generatedTsFileRows = [
		`export const theme = {`,
		...generatedTsObjectRows,
		`};`
	]
	const generatedTsFileContents = generatedTsFileRows.join("\n")

	console.log(chalk.white(`Generated file contents. (${generatedTsFileRows.length} rows)`))

	/**
	 * Write the file
	 */
	fs.writeFile(tsSrcFilePath, generatedTsFileContents, (err) => {

		/**
		 * In case of error, log error and exit
		 */
		if (err) {
			console.error(err)
			return process.exit(2)
		}

		/**
		 * Done. Exit.
		 */
		console.log(chalk.green(`Succesfully generated ts file.\n`))
		console.log(chalk.blue(generatedTsFileContents), "\n")
		return process.exit(0)
	})
})