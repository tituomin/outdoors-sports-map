import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as selectors from '../selectors';
import {getIsLoading as getIsUnitLoading} from '../../unit/selectors';
import {searchUnits, fetchUnitSuggestions, clearSearch} from '../actions';
import SearchBar from './SearchBar';
import SearchSuggestions from './SearchSuggestions';


class SearchContainer extends Component {
  static propTypes = {
    unitSuggestions: PropTypes.array,
    searchUnits: PropTypes.func,
    fetchUnitSuggestions: PropTypes.func,
    searchDisabled: PropTypes.bool
  }

  constructor(props) {
    super(props);

    this.state = {
      searchPhrase: ''
    };

    this.search = this.search.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.clear = this.clear.bind(this);
  }

  onInputChange(value: string) {
    console.log(value);
    this.setState({searchPhrase: value});
    this.getSuggestions(value);
  }

  search() {
    this.props.searchUnits(this.state.searchPhrase);
  }

  getSuggestions(searchPhrase: string) {
    this.props.fetchUnitSuggestions(searchPhrase);
  }

  clear() {
    this.setState({searchPhrase: ''});
    this.props.clearSearch();
  }

  render() {
    const {unitSuggestions, isActive, searchDisabled} = this.props;
    const {searchPhrase} = this.state;

    return (
      <div className="search-container">
        <SearchBar
          input={searchPhrase}
          onInput={this.onInputChange}
          onSubmit={this.search}
          onClear={this.clear}
          searchActive={isActive}
          disabled={searchDisabled} />
        <SearchSuggestions openAllResults={this.search} units={unitSuggestions}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  unitSuggestions: selectors.getUnitSuggestions(state),
  isActive: selectors.getIsActive(state),
  searchDisabled: getIsUnitLoading(state)
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({searchUnits, fetchUnitSuggestions, clearSearch}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
