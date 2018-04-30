import React, { Component, PropTypes } from 'react';
import { withStyles } from 'material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Autosuggest from 'react-autosuggest';
import ApolloClient from 'apollo-client';
import { gql, withApollo } from 'react-apollo';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import ReactDOM from 'react-dom'
import styles from './styles'

const searchLambdas = gql`
  query SearchAllLambdas($search: String!) {
    lambdas(first: 10, search: $search) {
      edges {
        node {
          name
          slug
          owner_id
          description
          owner{
            displayName
            username
          }
        }
      }
    }
  }
`;

function renderInput(inputProps) {
  const { classes, home, value, ref, ...other } = inputProps;

  return (
    <TextField
      id="uncontrolled"
      placeholder="Search"
      // helperTextClassName={classes.search}
      // InputClassName={classes.search}
      margin="normal"
      className={classes.searchInput}
      autoFocus={false}
      fullWidth={true}
      value={value}
      InputProps={{
        inputProps: { className: classes.search },
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }, classes) {
  const nameMatches = match(suggestion.label, query);
  const nameParts = parse(suggestion.label, nameMatches);

  const descMatches = match(suggestion.description || '', query);
  const descParts = parse(suggestion.description, descMatches);

  const userMatches = match(suggestion.owner.username, query);
  const userParts = parse(suggestion.owner.username, userMatches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div className={classes.highlights}>
        <div className={classes.highlightName}>
          {nameParts.map((part, index) => part.highlight
              ? <span key={index} style={{ fontWeight: 500 }}>
                  {part.text}
                </span>
              : <strong key={index} style={{ fontWeight: 300 }}>
                  {part.text}
                </strong>)}
        </div>

        <div className={classes.highlightDesc}>
          {descParts.map((part, index) => part.highlight
              ? <span key={index} style={{ fontWeight: 500 }}>
                  {part.text}
                </span>
              : <strong key={index} style={{ fontWeight: 300 }}>
                  {part.text}
                </strong>)}
        </div>

        <div className={classes.highlightOwner}> - by&nbsp;
          {userParts.map((part, index) => part.highlight
              ? <span key={index} style={{ fontWeight: 500 }}>
                  {part.text}
                </span>
              : <strong key={index} style={{ fontWeight: 300 }}>
                  {part.text}
                </strong>)}
        </div>
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options, classes) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square className={classes.resultsContainer}>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

@withStyles(styles)
@withApollo
export default class SearchBar extends Component {
  state = {
    value: '',
    suggestions: [],
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    client: PropTypes.instanceOf(ApolloClient)
  }

  focusSearch(){
    ReactDOM.findDOMNode(this.refs.searchField).firstChild.firstChild.firstChild.focus()
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.onChange(value).then((results) => {
      let newSuggestions = results.data.lambdas.edges.map(x => ({
        label: x.node.name,
        ...x.node,
      }))

      this.setState({
        suggestions: newSuggestions
      });
    })
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleSuggestionSelected = (event, { suggestion }) => {
    event.preventDefault();
    this.context.router.history.push(`/${suggestion.slug}`)
    this.setState({
      suggestions: [],
      value: ''
    });
  }

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onChange = searchValue => this.props.client.query({
    query: searchLambdas,
    variables: { search: searchValue },
  })

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.searchContainer}>
        <IconButton aria-label="Search" className={classes.searchIcon} disabled>
          <SearchIcon />
        </IconButton>

        {/* <TextField
          id="uncontrolled"
          placeholder="Search"
          helperTextClassName={classes.search}
          InputClassName={classes.search}
          onChange={(e) => this.onChange(e.target.value)}
          margin="normal"
          className={classes.searchInput}
        /> */}

          <Autosuggest
            ref='searchField'
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion,
            }}
            underlineShow={false}
            renderInputComponent={renderInput}
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
            onSuggestionSelected={this.handleSuggestionSelected}
            renderSuggestionsContainer={options => renderSuggestionsContainer(options, classes)}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={(e, v) => renderSuggestion(e, v, classes)}
            inputProps={{
              autoFocus: false,
              classes,
              placeholder: 'Search for Lambdas',
              value: this.state.value,
              onChange: this.handleChange,
              disableUnderline: true
            }}
          />

      </div>
    )
  }
}
