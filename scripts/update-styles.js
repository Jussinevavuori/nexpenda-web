const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

// All file paths
const filePaths = {
	src: {
		scss: path.join(__dirname, "../src/styles/main.scss"),
	},
	output: {
		mainTs: path.join(__dirname, "../src/styles/main.ts"),
		varsCss: path.join(__dirname, "../src/styles/vars.css")
	}
}

function getAllScssVariables() {
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

	// Read the main SCSS File and parse all rows
	const data = fs.readFileSync(filePaths.src.scss)
	const file = data.toString("utf-8")
	const rows = file.split("\n")
	console.log(chalk.green(`SCSS source file succesfully read (${rows.length} rows).`))

	// Get only rows which contain a variable declaration
	const scssVariableRows = rows.filter(row => !!scssVariableRegex.exec(row))
	console.log(chalk.white(`Found ${scssVariableRows.length} variable declarations.`))

	// Map the SCSS variables into an object. In all SCSS variable names,
	// change "-" to "_".
	const scssVariables = scssVariableRows.map(raw => {
		const [rawName, rawValue] = raw.split(":")
		const name = rawName.trim().replace(/(;|\$)/g, "")
		const value = rawValue.trim().replace(/(;|\$)/g, "")
		const jsonName = name.replace(/-/g, "_")

		return {
			raw,

			rawName,
			rawValue,

			name,
			value,
			jsonName,
		}
	})

	console.log(chalk.green(`Parsed variables.`))

	return scssVariables
}

function writeMainTsFile(scssVariables) {
	// Generate the styles/main.ts file as a string
	const rows = [
		`export const theme = {`,
		...scssVariables.map(_ => `\t${_.jsonName}: \`${_.value}\`,`),
		`};`
	]
	const fileContents = rows.join("\n")
	console.log(chalk.green(`Generated main.ts file contents. (${rows.length} rows)`))

	// Write the file
	fs.writeFileSync(filePaths.output.mainTs, fileContents)
	console.log(chalk.green(`Succesfully created main.ts`))
}

function writeVarsCssFile(scssVariables) {
	// Generate the styles/vars.css file as a string
	const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	const rows = [
		`:root {`,
		...scssVariables
			.filter(_ => !_.name.startsWith("primary-"))
			.map(_ => `--${_.name}: ${_.value};`),
		...nums.map(x => `--primary-${x}00: var(--blue-${x}00);`),
		`};`
	]
	const fileContents = rows.join("\n")
	console.log(chalk.green(`Generated vars.css file contents. (${rows.length} rows)`))

	// Write the file
	fs.writeFileSync(filePaths.output.varsCss, fileContents)
	console.log(chalk.green(`Succesfully created vars.css`))
}

try {
	// Get all scss variables from src file, write all output files
	const scssVariables = getAllScssVariables()
	writeMainTsFile(scssVariables)
	writeVarsCssFile(scssVariables)

	// Exit
	console.log(chalk.green(`Succesfully generated files.\n`))
	return process.exit(0)
} catch (e) {
	console.log(chalk.red("Error occured"), e)
}