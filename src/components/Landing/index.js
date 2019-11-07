import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import {withFirebase} from '../Firebase';
import * as ROUTES from '../../constants/routes';

import {withAuthorization} from '../Session';

const LandingPage = () => (
  <div>
    <h1>Put</h1>
    <PutForm/>
  </div>
);

const INITIAL_STATE = {
  name: '',
  data: '',
  file: '',
  error: null
};

class PutFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...INITIAL_STATE
    };
  }

  onSubmit = event => {
    const {name, data, file} = this.state;

    this
      .props
      .firebase
      .data()
      .push()
      .set({name, data, file})
      .then(() => {
        this.setState({
          ...INITIAL_STATE
        });
        this
          .props
          .history
          .push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({error});
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const {name, data, file, error} = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="name"
          value={name}
          onChange={this.onChange}
          type="text"
          placeholder="Full Name"/>
        <input
          name="data"
          value={data}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address" />
        <input
          name="file"
          value={file}
          onChange={this.onChange}
          type="file"
          placeholder="Email Address"/>
        <button type="submit">
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}




const PutForm = withRouter(withFirebase(PutFormBase));
export {PutForm};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(LandingPage);