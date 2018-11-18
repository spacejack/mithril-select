import * as m from 'mithril'
import MSelect from '../../src'
import EditableList from './editable-list'

/* Simple plain text options */
const countries = [
	{id: 'brazil', text: 'Brazil'},
	{id: 'canada', text: 'Canada'},
	{id: 'china', text: 'China'},
	{id: 'germany', text: 'Germany'},
	{id: 'india', text: 'India'},
	{id: 'uk', text: 'United Kingdom'},
	{id: 'usa', text: 'United States'}
]

const colours = [
	{id: 'red', text: 'Red'},
	{id: 'blue', text: 'Blue'},
	{id: 'green', text: 'Green'},
	{id: 'yellow', text: 'Yellow'},
	{id: 'orange', text: 'Orange'},
	{id: 'pink', text: 'Pink'}
]

/** Sports options use custom views to render options with text and images */
const sports = [
	{id: 1, text: 'Baseball', image: 'img/baseball.png'},
	{id: 2, text: 'Basketball', image: 'img/basketball.png'},
	{id: 3, text: 'Bowling', image: 'img/bowling.png'},
	{id: 4, text: 'Football', image: 'img/football.png'},
	{id: 5, text: 'Hockey', image: 'img/hockey.png'},
	{id: 6, text: 'Pool', image: 'img/pool.png'},
	{id: 7, text: 'Soccer', image: 'img/soccer.png'}
]

const languages = [
	{id: 'mandarin', text: 'Mandarin'},
	{id: 'spanish', text: 'Spanish'},
	{id: 'english', text: 'English'},
	{id: 'hindi', text: 'Hindi'},
	{id: 'arabic', text: 'Arabic'},
	{id: 'portuguese', text: 'Portuguese'},
	{id: 'bengali', text: 'Bengali'},
	{id: 'russian', text: 'Russian'},
	{id: 'japanese', text: 'Japanese'},
	{id: 'punjabi', text: 'Punjabi'},
	{id: 'german', text: 'German'},
	{id: 'javanese', text: 'Javanese'},
	{id: 'wu', text: 'Wu'},
	{id: 'malay', text: 'Malay'},
	{id: 'telugu', text: 'Telugu'},
	{id: 'vietnamese', text: 'Vietnamese'},
	{id: 'korean', text: 'Korean'},
	{id: 'french', text: 'French'},
	{id: 'marathi', text: 'Marathi'},
	{id: 'tamil', text: 'Tamil'}
]

/** Options for native browser select */
const nativeOpts = [
	{id: '', text: 'Native Select'},
	{id: '1', text: 'is here'},
	{id: '2', text: 'for'},
	{id: '3', text: 'comparison'},
	{id: '4', text: 'purposes'}
]

const animals = [
	{id: 'bird', text: 'Bird'},
	{id: 'cat', text: 'Cat'},
	{id: 'dog', text: 'Dog'}
]

// State of each select
let country = ''
let colour = colours[0].text
let colourId = colours[0].id
let sport = ''
let language = ''
let native = ''

// Demo component
const demoComponent = {
	view() {
		return m('.demo',
			m('p', 'Country: ' + country),
			m('p', 'Colour: ' + colour),
			m('p', 'Sport: ' + sport),
			m('p', 'Language: ' + language),
			m('p', 'Native select: ', native),
			m('p',
				m(MSelect, {
					options: [
						{value: '', view: 'Select a country...'}
					].concat(
						countries.map(c => ({value: c.id, view: c.text}))
					),
					class: 'demo-select',
					onchange: (val: string) => {
						country = !!val
							? countries.find(c => c.id === val)!.text
							: ''
					}
				}),
				// Example label for colour select
				m('label',
					{id: 'colour-label', for: 'colour-select', style: {marginRight: '0.25em'}},
					'Colour:'
				),
				m(MSelect, {
					options: colours.map(c => ({value: c.id, view: c.text})),
					id: 'colour-select',
					name: 'colour',  // Uses name
					value: colourId, // and value like a regular select element
					class: 'demo-select',
					ariaLabelledby: 'colour-label',
					onchange: (val: string) => {
						colourId = val
						colour = colours.find(c => c.id === colourId)!.text
					}
				}),
				m(MSelect, {
					// This select displays a prompt until an option is selected.
					promptView: () => [
						m('img.sport-image', {src: 'img/question.png'}),
						m('span.sport-text', 'Sport')
					],
					// This select's options are rendered views containing images for options
					options: sports.map(s => ({
						value: s.id,
						view: () => [
							m('img.sport-image', {src: s.image}),
							m('span.sport-text', s.text)
						]
					})),
					class: 'sport-select',
					onchange: (val: number) => {
						sport = sports.find(c => c.id === val)!.text
					}
				}),
				m(MSelect, {
					options: languages.map(l => ({value: l.id, view: l.text})),
					// This select uses a custom style for down arrow in head
					class: 'lang-select',
					onchange: (val: string) => {
						language = val != null
							? languages.find(c => c.id === val)!.text
							: ''
					}
				}),
				m('select',
					{
						onchange: m.withAttr('value', (val: string) => {
							native = val !== '' ?
								nativeOpts.find(n => n.id === val)!.text
								: ''
						})
					},
					nativeOpts.map(o =>
						m('option', {value: o.id}, o.text)
					)
				)
			),
			// Example with options that can be changed
			m('p',
				m('.edit-instruct', 'Add or remove animals:'),
				m(EditableList, {
					items: animals
				}),
				m(MSelect, {
					class: 'lang-select',
					options: [
						{value: '', view: 'Select Animal...'}
					].concat(
						animals.map(a => ({value: a.id, view: a.text}))
					)
				})
			)
		)
	}
}

m.mount(document.getElementById('select-demo')!, demoComponent)
