import * as m from 'mithril'
import mSelect from '../../../src'
import sportOption from './sport-option'

/* Simple plain text options */
const countries = [
	{value: null, content: "Select Country..."},
	{value: "brazil", content: "Brazil"},
	{value: "canada", content: "Canada"},
	{value: "china", content: "China"},
	{value: "germany", content: "Germany"},
	{value: "india", content: "India"},
	{value: "uk", content: "United Kingdom"},
	{value: "usa", content: "United States"}
]

const colours = [
	{value: "red", content: "Red"},
	{value: "blue", content: "Blue"},
	{value: "green", content: "Green"},
	{value: "yellow", content: "Yellow"},
	{value: "orange", content: "Orange"},
	{value: "pink", content: "Pink"}
]

/** Sports options have numeric values and use components for display */
const sports = [
	{value: 1, content: sportOption, attrs: {text: "Baseball", image: "img/baseball.png"}},
	{value: 2, content: sportOption, attrs: {text: "Basketball", image: "img/basketball.png"}},
	{value: 3, content: sportOption, attrs: {text: "Bowling", image: "img/bowling.png"}},
	{value: 4, content: sportOption, attrs: {text: "Football", image: "img/football.png"}},
	{value: 5, content: sportOption, attrs: {text: "Hockey", image: "img/hockey.png"}},
	{value: 6, content: sportOption, attrs: {text: "Pool", image: "img/pool.png"}},
	{value: 7, content: sportOption, attrs: {text: "Soccer", image: "img/soccer.png"}},
]

const languages = [
	{value: null, content: "Select Language..."},
	{value: "mandarin", content: "Mandarin"},
	{value: "spanish", content: "Spanish"},
	{value: "english", content: "English"},
	{value: "hindi", content: "Hindi"},
	{value: "arabic", content: "Arabic"},
	{value: "portuguese", content: "Portuguese"},
	{value: "bengali", content: "Bengali"},
	{value: "russian", content: "Russian"},
	{value: "japanese", content: "Japanese"},
	{value: "punjabi", content: "Punjabi"},
	{value: "german", content: "German"},
	{value: "javanese", content: "Javanese"},
	{value: "wu", content: "Wu"},
	{value: "malay", content: "Malay"},
	{value: "telugu", content: "Telugu"},
	{value: "vietnamese", content: "Vietnamese"},
	{value: "korean", content: "Korean"},
	{value: "french", content: "French"},
	{value: "marathi", content: "Marathi"},
	{value: "tamil", content: "Tamil"}
]

/** Options for native browser select */
const nativeOpts = [
	{value: "", content: "Native Select"},
	{value: "1", content: "is here"},
	{value: "2", content: "for"},
	{value: "3", content: "comparison"},
	{value: "4", content: "purposes"}
]

/** Demo component state */
interface State {
	country: string
	colour: string
	sport: string
	language: string
	native: string
}

/** Demo component */
export default {
	country: "",
	colour: "",
	sport: "",
	language: "",
	native: "",

	view() {
		return [
			m('p', "Country: " + this.country),
			m('p', "Colour: " + this.colour),
			m('p', "Sport: " + this.sport),
			m('p', "Language: " + this.language),
			m('p', "Native select: ", this.native),
			m(mSelect,
				{
					// This select prompts user with text content until an option is picked
					options: countries,
					class: 'app-select',
					onchange: (val: string) => {
						this.country = val != null
							? countries.find(c => c.value === val)!.content
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
					// This select defaults to the first option
					options: colours,
					id: 'colour-select',
					class: 'app-select',
					labelId: 'colour-label',
					onchange: (val: string) => {
						this.colour = colours.find(c => c.value === val)!.content
					}
				}
			),
			m(mSelect,
				{
					// This select's prompt is a vnode array.
					// It disappears as an option once the user selects something.
					promptContent: [
						m('img.sport-image', {src: 'img/question.png'}),
						m('span.sport-text', "Sport")
					],
					// This select's options are components containing images for options
					options: sports,
					class: 'sport-select',
					onchange: (val: number) => {
						this.sport = sports.find(c => c.value === val)!.attrs.text
					}
				}
			),
			m(mSelect,
				{
					// This select uses a custom style for down arrow in head
					options: languages,
					class: 'lang-select',
					onchange: (val: string) => {
						this.language = val != null
							? languages.find(c => c.value === val)!.content
							: ""
					}
				}
			),
			m('select',
				{
					onchange: m.withAttr('value', (val: string) => {
						this.native = val !== "" ?
							nativeOpts.find(n => n.value === val)!.content
							: ""
					})
				},
				nativeOpts.map(o =>
					m('option', {value: o.value}, o.content)
				)
			)
		]
	}
} as m.Comp<{},State>
