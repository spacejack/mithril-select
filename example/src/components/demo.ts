import * as m from 'mithril'
import mSelect from '../../../src'

/* Simple plain text options */
const countries = [
	{value: null, text: "Select Country..."},
	{value: "brazil", text: "Brazil"},
	{value: "canada", text: "Canada"},
	{value: "china", text: "China"},
	{value: "germany", text: "Germany"},
	{value: "india", text: "India"},
	{value: "uk", text: "United Kingdom"},
	{value: "usa", text: "United States"}
]

const colours = [
	{value: "red", text: "Red"},
	{value: "blue", text: "Blue"},
	{value: "green", text: "Green"},
	{value: "yellow", text: "Yellow"},
	{value: "orange", text: "Orange"},
	{value: "pink", text: "Pink"}
]

/** Sports options use custom views to render options with text and images */
const sports = [
	{value: 1, text: "Baseball", image: "img/baseball.png"},
	{value: 2, text: "Basketball", image: "img/basketball.png"},
	{value: 3, text: "Bowling", image: "img/bowling.png"},
	{value: 4, text: "Football", image: "img/football.png"},
	{value: 5, text: "Hockey", image: "img/hockey.png"},
	{value: 6, text: "Pool", image: "img/pool.png"},
	{value: 7, text: "Soccer", image: "img/soccer.png"}
]

const languages = [
	{value: null, text: "Select Language..."},
	{value: "mandarin", text: "Mandarin"},
	{value: "spanish", text: "Spanish"},
	{value: "english", text: "English"},
	{value: "hindi", text: "Hindi"},
	{value: "arabic", text: "Arabic"},
	{value: "portuguese", text: "Portuguese"},
	{value: "bengali", text: "Bengali"},
	{value: "russian", text: "Russian"},
	{value: "japanese", text: "Japanese"},
	{value: "punjabi", text: "Punjabi"},
	{value: "german", text: "German"},
	{value: "javanese", text: "Javanese"},
	{value: "wu", text: "Wu"},
	{value: "malay", text: "Malay"},
	{value: "telugu", text: "Telugu"},
	{value: "vietnamese", text: "Vietnamese"},
	{value: "korean", text: "Korean"},
	{value: "french", text: "French"},
	{value: "marathi", text: "Marathi"},
	{value: "tamil", text: "Tamil"}
]

/** Options for native browser select */
const nativeOpts = [
	{value: "", text: "Native Select"},
	{value: "1", text: "is here"},
	{value: "2", text: "for"},
	{value: "3", text: "comparison"},
	{value: "4", text: "purposes"}
]

/** Demo component */
const demoComponent: m.FactoryComponent = function() {
	let country = ""
	let colour = colours[0].text
	let colourId = colours[0].value
	let sport = ""
	let language = ""
	let native = ""

	return {
		view() {
			return [
				m('p', "Country: " + country),
				m('p', "Colour: " + colour),
				m('p', "Sport: " + sport),
				m('p', "Language: " + language),
				m('p', "Native select: ", native),
				m(mSelect,
					{
						options: countries.map(c => ({value: c.value, view: c.text})),
						class: 'demo-select',
						onchange: (val: string) => {
							country = val != null
								? countries.find(c => c.value === val)!.text
								: ""
						}
					}
				),
				// Example label for colour select
				m('label',
					{id: 'colour-label', for: 'colour-select', style: {marginRight: '0.25em'}},
					"Colour:"
				),
				m(mSelect,
					{
						options: colours.map(c => ({value: c.value, view: c.text})),
						id: 'colour-select',
						name: 'colour',  // Uses name
						value: colourId, // and value like a regular select element
						class: 'demo-select',
						labelId: 'colour-label',
						onchange: (val: string) => {
							colourId = val
							colour = colours.find(c => c.value === colourId)!.text
						}
					}
				),
				m(mSelect,
					{
						// This select displays a prompt until an option is selected.
						promptView: () => [
							m('img.sport-image', {src: 'img/question.png'}),
							m('span.sport-text', "Sport")
						],
						// This select's options are rendered views containing images for options
						options: sports.map(s => ({
							value: s.value,
							view: () => [
								m('img.sport-image', {src: s.image}),
								m('span.sport-text', s.text)
							]
						})),
						class: 'sport-select',
						onchange: (val: number) => {
							sport = sports.find(c => c.value === val)!.text
						}
					}
				),
				m(mSelect,
					{
						options: languages.map(l => ({value: l.value, view: l.text})),
						// This select uses a custom style for down arrow in head
						class: 'lang-select',
						onchange: (val: string) => {
							language = val != null
								? languages.find(c => c.value === val)!.text
								: ""
						}
					}
				),
				m('select',
					{
						onchange: m.withAttr('value', (val: string) => {
							native = val !== "" ?
								nativeOpts.find(n => n.value === val)!.text
								: ""
						})
					},
					nativeOpts.map(o =>
						m('option', {value: o.value}, o.text)
					)
				)
			]
		}
	}
}

export default demoComponent
