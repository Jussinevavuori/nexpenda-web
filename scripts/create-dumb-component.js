const path = require("path")
const fs = require("fs")
const chalk = require("chalk")

// Get component name from args
const componentName = process.argv[2]
console.log()
console.log(chalk.green("Creating", componentName))

// Validate component name
const regex = /^[A-Z][a-zA-Z]+$/
if (!regex.test(componentName)) {
	console.log(chalk.red(`Component name doesn't match pattern`))
	process.exit(0)
}

// Get directory name or default to /src/components
const directoryName = process.argv[3] || "components"

// Get target paths
const targetDirectory = path.join(__dirname, "..", "src", directoryName, componentName)
const targetComponentFilePath = path.join(targetDirectory, `${componentName}.tsx`)
const targetStylesFilePath = path.join(targetDirectory, `${componentName}.scss`)

// Get component file contents
const componentFile = `
import "./${componentName}.scss";
import React from "react";
import cx from "classnames";

export type ${componentName}Props = {

};

export function ${componentName}(props: ${componentName}Props) {

	return <div className={cx("${componentName}")}>

	</div>
}
`.trim()

// Get styles file contents
const stylesFile = `
@import "main";

.${componentName} {

};
`.trim()

fs.mkdirSync(targetDirectory)
console.log(chalk.green("\nCreated component directory at"), targetDirectory)

fs.appendFileSync(targetComponentFilePath, componentFile)
console.log(chalk.green("\nCreated component file in"), targetComponentFilePath)

fs.appendFileSync(targetStylesFilePath, stylesFile)
console.log(chalk.green("\nCreated styles file in"), targetStylesFilePath)

console.log(chalk.green("\nComplete"))