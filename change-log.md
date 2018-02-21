# Change log

## v0.4.0

* Deprecated `attrs.promptContent`, `attrs.promptAttrs`, `attrs.options.content` and `attrs.options.attrs`.
* Added `attrs.promptView` and `attrs.options.view` to replace old content. `view` is either a render function that returns vnodes, or a string primitve.
* Refactored implementation for clarity and optimization.
* Updated docs and examples.

## v0.3.0

* Deprecated `defaultValue` attr, replaced by `initialValue`. (`defaultValue` is still supported.)
* Added `value` attr which enables the application to set/update the select value every render.
* `options` (and all other attrs) can now be updated between renders. (Updating `initialValue` will have no effect.)

## v0.2.0

* Added `name` attr. If present, a hidden form input will be rendered having this name with the current selected option value (coerced to string if the value is some other type.)

## v0.1.0

* Initial release.
