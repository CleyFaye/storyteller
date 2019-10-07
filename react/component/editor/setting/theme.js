import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import exState from "@cley_faye/react-utils/lib/mixin/exstate";
import changeHandler from "@cley_faye/react-utils/lib/mixin/changehandler";
import Box from "@material-ui/core/Box";
import {getAll} from "../../../service/setting";
import {setAll} from "../../../service/setting";
import {list as listThemes} from "../../../service/theme";

class Theme extends React.Component {
  constructor(props) {
    super(props);
    exState(this, {
      theme: "",
      themes: null,
      uiScale: 0,
      loading: true,
    });
    changeHandler(this);
  }

  componentDidMount() {
    getAll()
      .then(remoteConfig => this.updateState(remoteConfig))
      .then(() => listThemes())
      .then(themes => this.updateState({
        loading: false,
        themes,
      }));
  }

  handleSave() {
    this.updateState({loading: true})
      .then(() => setAll({
        theme: this.state.theme,
        uiScale: this.state.uiScale,
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

  renderThemeList() {
    if (this.state.themes === null) {
      return;
    }
    return <React.Fragment>
      <br />
      {this.state.themes.map(themeName => 
        <Button
          key={themeName}
          color="secondary"
          onClick={() => this.updateState({theme: themeName})}>
          {themeName}
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
          label="Theme name"
          disabled
          value={this.state.theme}
          onChange={this.changeHandler("theme")}
          fullWidth />
        {this.renderThemeList()}
        <br />
        <p>
          Select the size of the player elements. 10 is regular size, higher
          values makes everything smaller.
        </p>
        <Slider
          defaultValue={this.state.uiScale}
          getAriaValueText={value => value.toString()}
          valueLabelDisplay="auto"
          onChange={(_, uiScale) => this.updateState({uiScale})}
          step={2}
          marks
          min={10}
          max={40}
        />
      </Box>
      {this._renderSaveButton()}
    </React.Fragment>;
  }
}

export default Theme;