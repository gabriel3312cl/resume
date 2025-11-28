package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"text/template"
)

// Structs to match the JSON structure from data.js
type FullCVData struct {
	EN CVContent `json:"en"`
	ES CVContent `json:"es"`
}

type CVContent struct {
	Profile      Profile             `json:"profile"`
	About        About               `json:"about"`
	Experience   []Experience        `json:"experience"`
	Education    []Education         `json:"education"`
	Certificates Certifications      `json:"certifications"`
	Courses      Courses             `json:"courses"`
	Skills       map[string][]string `json:"skills"`
	Projects     []Project           `json:"projects"`
}

type Profile struct {
	Name     string  `json:"name"`
	Title    string  `json:"title"`
	Tagline  string  `json:"tagline"`
	Contact  Contact `json:"contact"`
}

type Contact struct {
	Email    string `json:"email"`
	LinkedIn string `json:"linkedin"`
	GitHub   string `json:"github"`
	YouTube  string `json:"youtube"`
	Location string `json:"location"`
}

type About struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type Experience struct {
	Company         string   `json:"company"`
	Period          string   `json:"period"`
	Role            string   `json:"role"`
	Responsibilities []string `json:"responsibilities"`
}

type Education struct {
	Institution  string `json:"institution"`
	Degree       string `json:"degree"`
	Period       string `json:"period"`
	Achievements string `json:"achievements"`
}

type Certifications struct {
	Title string      `json:"title"`
	List  []NameItems `json:"list"`
}

type Courses struct {
	Title string      `json:"title"`
	List  []NameItems `json:"list"`
}

type NameItems struct {
	Name  string   `json:"name"`
	Items []string `json:"items"`
}

type Project struct {
	Name        string   `json:"name"`
	Summary     string   `json:"summary"`
	Tech        []string `json:"tech"`
	Description string   `json:"description"`
}

// TemplateData holds the content for a specific language and the switcher info
type TemplateData struct {
	Content      CVContent
	SwitcherLink string
	SwitcherText string
}

// Updated Markdown template with a language switcher
const readmeTemplate = `[{{.SwitcherText}}]({{.SwitcherLink}})

# {{.Content.Profile.Name}}

## {{.Content.Profile.Title}}

_{{.Content.Profile.Tagline}}_ 

[Email](mailto:{{.Content.Profile.Contact.Email}}) | [LinkedIn]({{.Content.Profile.Contact.LinkedIn}}) | [GitHub]({{.Content.Profile.Contact.GitHub}}) | [YouTube]({{.Content.Profile.Contact.YouTube}}) | 📍 {{.Content.Profile.Contact.Location}}

## {{.Content.About.Title}}

{{.Content.About.Description | cleanHTML}}

## Experience
{{range .Content.Experience}}
### {{.Role}} at {{.Company}}

*{{.Period}}*
{{range .Responsibilities}}
- {{ . | cleanStrong}}{{end}}
{{end}}

## Projects
{{range .Content.Projects}}
### {{.Name}}

_{{.Summary}}_ 

**Technologies:** {{join .Tech ", "}}

{{.Description}}
{{end}}

## Skills
{{range $category, $skills := .Content.Skills}}
- **{{$category}}:** {{join $skills ", "}}
{{end}}

## Education
{{range .Content.Education}}
### {{.Degree}}

*{{.Institution}} ({{.Period}})*
{{if .Achievements}}
- {{.Achievements}}
{{end}}
{{end}}

## {{.Content.Certificates.Title}}
{{range .Content.Certificates.List}}
### {{.Name}}
{{range .Items}}
- {{.}}
{{end}}{{end}}

## {{.Content.Courses.Title}}
{{range .Content.Courses.List}}
### {{.Name}}
{{range .Items}}
- {{.}}
{{end}}{{end}}
`

// generateReadme creates a README file from the given data and template.
func generateReadme(data TemplateData, tmpl *template.Template, outputFilename string, projectDir string) {
	readmePath := filepath.Join(projectDir, outputFilename)

	// Create the output file.
	file, err := os.Create(readmePath)
	if err != nil {
		log.Fatalf("Error creating file %s: %v", readmePath, err)
	}
	defer file.Close()

	// Execute the template with the data and write the output to the file.
	err = tmpl.Execute(file, data)
	if err != nil {
		log.Fatalf("Error executing template for %s: %v", outputFilename, err)
	}

	fmt.Printf("Successfully generated %s\n", readmePath)
}

func main() {
	// Get the current working directory, which should be the project root.
	projectDir, err := os.Getwd()
	if err != nil {
		log.Fatalf("Error getting current working directory: %v", err)
	}

	// Build path to the data file, relative to the project root.
	dataFilePath := filepath.Join(projectDir, "assets", "data", "data.js")

	// Read the JavaScript file.
	jsContent, err := ioutil.ReadFile(dataFilePath)
	if err != nil {
		log.Fatalf("Error reading %s: %v", dataFilePath, err)
	}

	// Clean the JS content to extract the raw JSON object string.
	contentStr := string(jsContent)
	contentStr = strings.TrimSpace(contentStr)
	contentStr = strings.TrimPrefix(contentStr, "window.cvData = ")
	contentStr = strings.TrimSuffix(contentStr, ";")

	// Unmarshal the JSON string into the Go structs.
	var cvData FullCVData
	err = json.Unmarshal([]byte(contentStr), &cvData)
	if err != nil {
		log.Fatalf("Error unmarshaling JSON: %v", err)
	}

	// Define custom functions for the template.
	funcMap := template.FuncMap{
		"join":      strings.Join,
		"cleanHTML": func(s string) string { return regexp.MustCompile("<[^>]*>").ReplaceAllString(s, "") },
		"cleanStrong": func(s string) string { return regexp.MustCompile(`</?strong>`).ReplaceAllString(s, "**") },
	}

	// Create and parse the template.
	tmpl, err := template.New("readme").Funcs(funcMap).Parse(strings.TrimSpace(readmeTemplate))
	if err != nil {
		log.Fatalf("Error parsing template: %v", err)
	}

	// Generate English README
	enData := TemplateData{
		Content:      cvData.EN,
		SwitcherLink: "README.es.md",
		SwitcherText: "Ver en español",
	}
	generateReadme(enData, tmpl, "README.md", projectDir)

	// Generate Spanish README
	esData := TemplateData{
		Content:      cvData.ES,
		SwitcherLink: "README.md",
		SwitcherText: "Read in English",
	}
	generateReadme(esData, tmpl, "README.es.md", projectDir)
}