import * as m from 'mithril'

interface Attrs {
	image: string
	text: string
}

export default {
	view({attrs: {image, text}}) {
		return [
			m('img.sport-image', {src: image}),
			m('span.sport-text', text)
		]
	}
} as m.Component<Attrs>
