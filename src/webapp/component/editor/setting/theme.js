import changeHandlerMixin from "@cley_faye/react-utils/lib/mixin/changehandler.js";
import {TextField, Typography, Slider, Button, Box} from "@material-ui/core";
import React from "react";

import {getAll, setAll} from "../../../service/setting.js";
import {list as listThemes} from "../../../service/theme.js";

class Theme extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      theme: "",
      themes: null,
      uiScale: 0,
    };
    this.handleChange = changeHandlerMixin(this);
  }

  componentDidMount() {
    getAll()
      .then((remoteConfig) => this.setState(remoteConfig))
      .then(() => listThemes())
      .then((themes) =>
        this.setState({
          loading: false,
          themes,
        }),
      );
  }

  handleSave() {
    this.setState({loading: true})
      .then(() =>
        setAll({
          theme: this.state.theme,
          uiScale: this.state.uiScale,
        }),
      )
      .then(() => this.setState({loading: false}));
  }

  _renderSaveButton() {
    return (
      <Button color="primary" onClick={() => this.handleSave()}>
        Save settings
      </Button>
    );
  }

  renderThemeList() {
    if (this.state.themes === null) {
      return;
    }
    return (
      <>
        <br />
        {this.state.themes.map((themeName) => (
          <Button
            color="secondary"
            key={themeName}
            onClick={() => this.setState({theme: themeName})}
          >
            {themeName}
          </Button>
        ))}
        <br />
      </>
    );
  }

  render() {
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
            label="Theme name"
            name="theme"
            onChange={this.handleChange}
            value={this.state.theme}
            variant="filled"
          />
          {this.renderThemeList()}
          <br />
          <p>
            Select the size of the player elements. 10 is regular size, higher values makes
            everything smaller.
          </p>
          <Slider
            defaultValue={this.state.uiScale}
            getAriaValueText={(value) => value.toString()}
            marks
            max={40}
            min={10}
            onChange={(_, uiScale) => this.setState({uiScale})}
            step={2}
            valueLabelDisplay="auto"
          />
        </Box>
        {this._renderSaveButton()}
      </>
    );
  }
}

export default Theme;
