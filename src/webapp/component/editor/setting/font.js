import changeHandlerMixin from "@cley_faye/react-utils/lib/mixin/changehandler.js";
import {
  TextField,
  Typography,
  Slider,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@material-ui/core";
import React from "react";

import {list as listFonts} from "../../../service/font.js";
import {getAll, setAll} from "../../../service/setting.js";

const getAria = (value) => value.toString();

class Font extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fonts: null,
      loading: true,
      pdfFont: "",
      pdfFontBold: false,
      pdfFontItalic: false,
      pdfFontSize: 0,
    };
    this.handleChange = changeHandlerMixin(this);
  }

  componentDidMount = () => {
    (async () => {
      const remoteConfig = await getAll();
      const fonts = await listFonts();
      this.setState({...remoteConfig, fonts, loading: false});
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  handleFontChange = (_, pdfFontSize) => {
    this.setState({pdfFontSize});
  };

  handleBoldChange = (e) => this.setState({pdfFontBold: e.target.checked});

  handleItalicChange = (e) => this.setState({pdfFontItalic: e.target.checked});

  handleSave = () => {
    this.setState({loading: true});
    (async () => {
      await setAll({
        pdfFont: this.state.pdfFont,
        pdfFontBold: this.state.pdfFontBold,
        pdfFontItalic: this.state.pdfFontItalic,
        pdfFontSize: this.state.pdfFontSize,
      });
      this.setState({loading: false});
      // eslint-disable-next-line promise/prefer-await-to-then
    })().catch(() => {});
  };

  _renderSaveButton = () => (
    <Button color="primary" onClick={this.handleSave}>
      Save settings
    </Button>
  );

  renderFontList = () => {
    if (this.state.fonts === null) {
      return;
    }
    return (
      <>
        <br />
        {this.state.fonts.map((fontName) => (
          <Button
            color="secondary"
            key={fontName}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => this.setState({pdfFont: fontName})}
          >
            {fontName}
          </Button>
        ))}
        <br />
      </>
    );
  };

  render = () => {
    if (this.state.loading) {
      return <Typography variant="h4">Loading…</Typography>;
    }
    return (
      <>
        {this._renderSaveButton()}
        <Box>
          <TextField
            disabled
            fullWidth
            label="Font name"
            name="pdfFont"
            onChange={this.handleChange}
            value={this.state.pdfFont}
            variant="filled"
          />
          {this.renderFontList()}
          <br />
          <p>Size of the font</p>
          <Slider
            defaultValue={this.state.pdfFontSize}
            getAriaValueText={getAria}
            marks
            max={150}
            min={4}
            onChange={this.handleFontChange}
            step={1}
            valueLabelDisplay="auto"
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.pdfFontBold}
                color="primary"
                onChange={this.handleBoldChange}
                value="bold"
              />
            }
            label="Bold"
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.pdfFontItalic}
                color="primary"
                onChange={this.handleItalicChange}
                value="italic"
              />
            }
            label="Italic"
          />
        </Box>
        {this._renderSaveButton()}
      </>
    );
  };
}

export default Font;
