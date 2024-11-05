import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import changeHandler from "@cley_faye/react-utils/lib/mixin/changehandler";
import Box from "@material-ui/core/Box";
import {getAll} from "../../../service/setting";
import {setAll} from "../../../service/setting";
import {list as listFonts} from "../../../service/font";

class Font extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      pdfFont: "",
      pdfFontBold: false,
      pdfFontItalic: false,
      pdfFontSize: 0,
      fonts: null,
      loading: true,
    });
    changeHandler(this);
  }

  componentDidMount() {
    getAll()
      .then(remoteConfig => this.updateState(remoteConfig))
      .then(() => listFonts())
      .then(fonts => this.updateState({
        loading: false,
        fonts,
      }));
  }

  handleSave() {
    this.updateState({loading: true})
      .then(() => setAll({
        pdfFont: this.state.pdfFont,
        pdfFontBold: this.state.pdfFontBold,
        pdfFontItalic: this.state.pdfFontItalic,
        pdfFontSize: this.state.pdfFontSize,
      }))
      .then(() => this.updateState({loading: false}));
  }

  _renderSaveButton() {
    return <Button
      color="primary"
      onClick={() => this.handleSave()}>
      Save settings
    </Button>;
  }

  renderFontList() {
    if (this.state.fonts === null) {
      return;
    }
    return <React.Fragment>
      <br />
      {this.state.fonts.map(fontName => 
        <Button
          key={fontName}
          color="secondary"
          onClick={() => this.updateState({pdfFont: fontName})}>
          {fontName}
        </Button>
      )}
      <br />
    </React.Fragment>;
  }

  render() {
    if (this.state.loading) {
      return <Typography variant="h4">Loading…</Typography>;
    }
    return <React.Fragment>
      {this._renderSaveButton()}
      <Box>
        <TextField
          variant="filled"
          label="Font name"
          disabled
          value={this.state.pdfFont}
          onChange={this.changeHandler("pdfFont")}
          fullWidth />
        {this.renderFontList()}
        <br />
        <p>
          Size of the font
        </p>
        <Slider
          defaultValue={this.state.pdfFontSize}
          getAriaValueText={value => value.toString()}
          valueLabelDisplay="auto"
          onChange={(_, pdfFontSize) => this.updateState({pdfFontSize})}
          step={1}
          marks
          min={4}
          max={150}
        />
        <br />
        <FormControlLabel
          control={<Checkbox
            checked={this.state.pdfFontBold}
            onChange={e => this.updateState({pdfFontBold: e.target.checked})}
            value="bold"
            color="primary" />}
          label="Bold" />
        <br />
        <FormControlLabel
          control={<Checkbox
            checked={this.state.pdfFontItalic}
            onChange={e => this.updateState({pdfFontItalic: e.target.checked})}
            value="italic"
            color="primary" />}
          label="Italic" />
      </Box>
      {this._renderSaveButton()}
    </React.Fragment>;
  }
}

export default Font;