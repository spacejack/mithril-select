# Change log

## v0.3.0

* Deprecated `defaultValue` attr, replaced by `initialValue`. (`defaultValue` is still supported.)
* Added `value` attr which enables the application to set/update the select value every render.
* `options` (and all other attrs) can now be updated between renders. (Updating `initialValue` will have no effect.)

## v0.2.0

* Added `name` attr. If present, a hidden form input will be rendered having this name with the current selected option value (coerced to string if the value is some other type.)

## v0.1.0

* Initial release.
