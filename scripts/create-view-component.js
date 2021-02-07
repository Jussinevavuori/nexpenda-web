const path = require("path")
const fs = require("fs")
const chalk = require("chalk")

// Get view and component names from args
const viewName = process.argv[2]
const componentName = process.argv[3]
console.log()
console.log(chalk.green("Creating", componentName, "under view", viewName))

// Validate component name
const regex = /^[A-Z][a-zA-Z]+$/
if (!regex.test(componentName)) {
	console.log(chalk.red(`Component name doesn't match pattern`))
	process.exit(0)
}

// Get target paths
const targetDirectory = path.join(__dirname, "..", "src", "views", viewName, componentName)
const targetComponentFilePath = path.join(targetDirectory, `${componentName}.tsx`)
const targetControllerFilePath = path.join(targetDirectory, `use${componentName}Controller.ts`)
const targetStylesFilePath = path.join(targetDirectory, `${componentName}.scss`)

// Get component file contents
const componentFile = `
import "./${componentName}.scss";
import React from "react";
import cx from "classnames";
import { use${componentName}Controller } from "./use${componentName}Controller";

export type ${componentName}Props = {

};

export function ${componentName}(props: ${componentName}Props) {

	const controller = use${componentName}Controller(props)

	return <div className={cx("${componentName}")}>

	</div>
}
`.trim()

// Get controller file contents
const controllerFile = `
import { ${componentName}Props } from "./${componentName}";

export function use${componentName}Controller(props: ${componentName}Props) {

	return {};

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

fs.appendFileSync(targetControllerFilePath, controllerFile)
console.log(chalk.green("\nCreated controller file in"), targetControllerFilePath)

fs.appendFileSync(targetStylesFilePath, stylesFile)
console.log(chalk.green("\nCreated styles file in"), targetStylesFilePath)

console.log(chalk.green("\nComplete"))