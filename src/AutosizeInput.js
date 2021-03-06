const React = require('react');

const sizerStyle = { position: 'absolute', top: 0, left: 0, visibility: 'hidden', height: 0, overflow: 'scroll', whiteSpace: 'pre' };

const AutosizeInput = React.createClass({
	propTypes: {
		className: React.PropTypes.string,               // className for the outer element
		defaultValue: React.PropTypes.any,               // default field value
		inputClassName: React.PropTypes.string,          // className for the input element
		inputStyle: React.PropTypes.object,              // css styles for the input element
		minWidth: React.PropTypes.oneOfType([            // minimum width for input element
			React.PropTypes.number,
			React.PropTypes.string,
		]),
		onChange: React.PropTypes.func,                  // onChange handler: function(newValue) {}
		placeholder: React.PropTypes.string,             // placeholder text
		placeholderIsMinWidth: React.PropTypes.bool,   // don't collapse size to less than the placeholder
		style: React.PropTypes.object,                   // css styles for the outer element
		value: React.PropTypes.any,                      // field value
	},
	getDefaultProps () {
		return {
			minWidth: 1,
		};
	},
	getInitialState () {
		return {
			inputWidth: this.props.minWidth,
		};
	},
	componentDidMount () {
		this.copyInputStyles();
		this.updateInputWidth();
	},
	componentDidUpdate () {
		this.updateInputWidth();
	},
	copyInputStyles () {
		if (!this.isMounted() || !window.getComputedStyle) {
			return;
		}
		const inputStyle = window.getComputedStyle(this._input);
		if (!inputStyle) {
			return;
		}
		const widthNode = this._sizer;
		widthNode.style.fontSize = inputStyle.fontSize;
		widthNode.style.fontFamily = inputStyle.fontFamily;
		widthNode.style.fontWeight = inputStyle.fontWeight;
		widthNode.style.fontStyle = inputStyle.fontStyle;
		widthNode.style.letterSpacing = inputStyle.letterSpacing;
		if (this.props.placeholder) {
			const placeholderNode = this._placeholderSizer;
			placeholderNode.style.fontSize = inputStyle.fontSize;
			placeholderNode.style.fontFamily = inputStyle.fontFamily;
			placeholderNode.style.fontWeight = inputStyle.fontWeight;
			placeholderNode.style.fontStyle = inputStyle.fontStyle;
			placeholderNode.style.letterSpacing = inputStyle.letterSpacing;
		}
	},
	updateInputWidth () {
		if (!this.isMounted() || typeof this._sizer.scrollWidth === 'undefined') {
			return;
		}
		let newInputWidth;
		if (this.props.placeholder && (!this.props.value || (this.props.value && this.props.placeholderIsMinWidth))) {
			newInputWidth = Math.max(this._sizer.scrollWidth, this._placeholderSizer.scrollWidth) + 2;
		} else {
			newInputWidth = this._sizer.scrollWidth + 2;
		}
		if (newInputWidth < this.props.minWidth) {
			newInputWidth = this.props.minWidth;
		}
		if (newInputWidth !== this.state.inputWidth) {
			this.setState({
				inputWidth: newInputWidth,
			});
		}
	},
	getInput () {
		return this._input;
	},
	focus () {
		this._input.focus();
	},
	blur () {
		this._input.blur();
	},
	select () {
		this._input.select();
	},
	render () {
		const sizerValue = (this.props.defaultValue || this.props.value || '');
		const wrapperStyle = this.props.style || {};
		if (!wrapperStyle.display) wrapperStyle.display = 'inline-block';
		const inputStyle = Object.assign({}, this.props.inputStyle);
		inputStyle.width = this.state.inputWidth + 'px';
		inputStyle.boxSizing = 'content-box';
		const placeholder = this.props.placeholder ? <div ref={(c) => { this._placeholderSizer = c }} style={sizerStyle}>{this.props.placeholder}</div> : null;
		return (
			<div className={this.props.className} style={wrapperStyle}>
				<input {...this.props} ref={(c) => { this._input = c }} className={this.props.inputClassName} style={inputStyle} />
				<div ref={(c) => { this._sizer = c }} style={sizerStyle}>{sizerValue}</div>
				{placeholder}
			</div>
		);
	},
});

module.exports = AutosizeInput;
